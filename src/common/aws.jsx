import axios from "axios";

export const uploadImage = async (img) => {
    try {
        // Get the pre-signed URL
        const { data: { uploadURL } } = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/get-upload-url`);



        // Upload the image
        await axios.put(uploadURL, img, {
            headers: {
                'content-type': 'image/jpeg' // Use the actual MIME type of the image
            },
            transformRequest: [(data) => data]  // Prevent axios from trying to transform the file data
        });

        // Return the URL where the image can be accessed
        return uploadURL.split("?")[0];
    } catch (error) {
        console.error('Error uploading image:', error);
        console.error('Error response:', error.response?.data);
        throw error;  // Re-throw the error so it can be handled by the caller
    }
}