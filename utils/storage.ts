import * as FileSystem from 'expo-file-system';

/**
 * Copies a local image URI from the cache or temp directory into the
 * persistent document directory to ensure it is not deleted.
 * @param sourceUri The temporary file URI
 * @returns The persistent file URI
 */
export async function saveImageLocally(sourceUri: string): Promise<string> {
    try {
        if (!sourceUri) return '';

        // If it's already in the DocumentDirectory, don't copy again
        if (sourceUri.startsWith(FileSystem.documentDirectory || '')) {
            return sourceUri;
        }

        const filename = sourceUri.split('/').pop() || `image_${Date.now()}.jpg`;
        const destinationUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
            from: sourceUri,
            to: destinationUri,
        });

        return destinationUri;
    } catch (error) {
        console.error('Error saving image locally:', error);
        // Fall back to original URI if copy fails
        return sourceUri;
    }
}
