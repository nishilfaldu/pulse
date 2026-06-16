import { DecryptionAnimation } from '@/components/ui/DecryptionAnimation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { uploadToCloudflare } from '@/lib/cloudflare-upload';
import { useAction, useMutation } from 'convex/react';
import { File } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function UploadingScreen() {
  const { videoUri, questId, duration, caption } = useLocalSearchParams<{
    videoUri: string;
    questId: string;
    duration: string;
    caption?: string;
  }>();

  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'uploading' | 'processing' | 'complete'>('uploading');

  const getUploadUrl = useAction(api.submissions.getUploadUrl);
  const markComplete = useMutation(api.submissions.markUploadComplete);
  const completeQuest = useMutation(api.quests.completeQuest);

  useEffect(() => {
    async function upload() {
      try {
        // Get file size
        const file = new File(videoUri);
        const fileInfo = await file.info();
        const fileSize = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;

        // Get upload URL
        const { uploadUrl, videoId, submissionId } = await getUploadUrl({
          questId: questId as Id<"quests">,
          duration: parseInt(duration),
          fileSize: fileSize!,
          caption: caption,
        });

        console.log('Upload URL:', uploadUrl);
        console.log('Video ID:', videoId);
        console.log('Submission ID:', submissionId);

        // Upload with progress
        await uploadToCloudflare(
          videoUri,
          (percent) => {
            console.log('Upload progress:', percent);
            setProgress(percent);
          },
          () => Promise.resolve({ uploadUrl, videoId })
        );

        setPhase('processing');

        // Mark upload complete
        await markComplete({ submissionId });

        // Complete quest
        await completeQuest({ questId: questId as Id<"quests"> });

        setPhase('complete');

        // Navigate to lobby (feed is now unlocked)
        setTimeout(() => {
          router.replace('/lobby');
        }, 1000);

      } catch (error) {
        console.error('Upload failed:', error);
        // TODO: Show error toast
        router.back();
      }
    }

    upload();
  }, []);

  return (
    <View style={styles.container}>
      <DecryptionAnimation progress={progress} phase={phase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
