import React, { useContext, useState, useRef, useEffect } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    Modal,
    Dimensions
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { GlobalContext } from "GlobalContext"; 

export const AddIdeaScreen = ({ route, navigation }) => {
    const { personId } = route.params;
    const { addIdea } = useContext(GlobalContext); 
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState(""); 
    const [availableSizes, setAvailableSizes] = useState([]); 

    const cameraRef = useRef(null);  

    // Request Camera permission and get available picture sizes
	const takePicture = async (setImage) => {
		const { status } = await Camera.requestCameraPermissionsAsync();
	
		if (status === "granted") {
			if (cameraRef.current) {
				// Get available picture sizes from the camera
				const sizes = await cameraRef.current.getAvailablePictureSizesAsync("4:3");
				setAvailableSizes(sizes);
				console.log("Available Sizes:", sizes);
	
				// Select the largest available size or fallback to default if empty
				const selectedSize = sizes.length > 0 ? sizes[sizes.length - 1] : null;
	
				if (selectedSize) {
					console.log(`Selected size for image capture: ${selectedSize}`);
					// Adjust the camera settings here based on the selected size if necessary.
				}
			}
	
			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [2, 3],  // Aspect ratio 2:3
				quality: 1,
			});
	
			if (!result.canceled && result.assets[0].uri) {
				setImage(result.assets[0].uri);
			} else {
				setModalMessage("Image capturing was unsuccessful.");
				setModalVisible(true); 
			}
		} else {
			setModalMessage("Camera permission is required.");
			setModalVisible(true); // Show modal for camera permission
		}
	};
	
	

    // Save the idea
    const saveIdea = (text, image, personId, addIdea, navigation) => {
        if (text && image) {
            const screenWidth = Dimensions.get("window").width;
            const imageWidth = screenWidth * 0.6; // 60% of the screen width
            const aspectRatio = 2 / 3;
            const imageHeight = imageWidth * aspectRatio;

            addIdea(personId, text, image, imageWidth, imageHeight);
            navigation.navigate("IdeaScreen", { personId });
        } else {
            setModalMessage("Please provide both text & image!");
            setModalVisible(true); 
        }
    };


	const screenWidth = Dimensions.get("window").width;
    const imageWidth = screenWidth * 0.6; // 60% of screen width
    const aspectRatio = 2 / 3;
    const imageHeight = imageWidth * aspectRatio;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.containerAddIdea}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.viewAddIdea}>
                    <Text style={styles.titleAddIdea}>Add a Gift Idea</Text>
                    <TextInput
                        style={styles.inputAddIdea}
                        placeholder="Gift Idea"
                        value={text}
                        onChangeText={setText}
                    />
                    {image && (
                        <Image
                            source={{ uri: image }}
                            style={{
                                ...styles.imageAddIdea,
                                width: imageWidth,
                                height: imageHeight,
                            }}
                        />
                    )}

                    {/* Take Picture button */}
                    <TouchableOpacity
                        style={[styles.buttonAddIdea, { backgroundColor: "green" }]}
                        onPress={() => takePicture(setImage)}
                    >
                        <Text style={styles.buttonTextAddIdea}>Take Picture</Text>
                    </TouchableOpacity>

                    {/* Save button */}
                    <TouchableOpacity
                        style={[styles.buttonAddIdea, { backgroundColor: "#007BFF" }]}
                        onPress={() => saveIdea(text, image, personId, addIdea, navigation)}
                    >
                        <Text style={styles.buttonTextAddIdea}>Save</Text>
                    </TouchableOpacity>

                    {/* Cancel button */}
                    <TouchableOpacity
                        style={[styles.buttonAddIdea, { backgroundColor: "red" }]}
                        onPress={() => navigation.navigate("IdeaScreen", { personId })}
                    >
                        <Text style={styles.buttonTextAddIdea}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Custom Modal for Validation Messages */}
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Validation Error</Text>
                                <Text style={styles.modalMessage}>{modalMessage}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    viewAddIdea: {
        flex: 1,
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    containerAddIdea: {
        flex: 1,
    },
    titleAddIdea: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 35,
        color: "black",
    },
    inputAddIdea: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    imageAddIdea: {
        marginBottom: 20,
        borderRadius: 8,
        resizeMode: "cover",
    },
    buttonAddIdea: {
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },
    buttonTextAddIdea: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddIdeaScreen;
