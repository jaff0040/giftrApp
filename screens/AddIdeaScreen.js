import React, { useContext, useRef, useState } from "react";
import { GlobalContext } from "GlobalContext";
import CustomModal from '../components/CustomModal';  // Import CustomModal
import { CameraView, useCameraPermissions } from "expo-camera";
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Button, Image, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from "react-native";

// Helper functions
export const takePicture = async (cameraRef, setImage, setPictureSize) => {
	if (cameraRef.current) {
		try {
			const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
			if (sizes && sizes.length > 0) {
				const chosenSize = sizes[sizes.length - 1];
				setPictureSize(chosenSize);
				let result = await cameraRef.current.takePictureAsync({
					quality: 1,
					aspect: [2, 3],
				});
				setImage(result.uri);
			}
		} catch (error) {
			console.error("Error capturing picture: ", error);
		}
	}
};

export const flipCamera = (facing, setFacing) => {
	if (facing === "back") setFacing("front");
	else setFacing("back");
};

export const AddIdeaScreen = ({ route, navigation }) => {
	const { personId } = route.params;
	const { saveIdea } = useContext(GlobalContext); 
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [pictureSize, setPictureSize] = useState(null);
	const cameraRef = useRef(null);
	const [facing, setFacing] = useState("back");
	const screenWidth = Dimensions.get("window").width;
	const imageWidth = screenWidth * 0.6; 
	const aspectRatio = 2 / 3;
	const imageHeight = imageWidth * aspectRatio;

	if (!permission) return <View />;
	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Camera permission is required.</Text>
				<Button onPress={requestPermission} title="Grant permission" />
			</View>
		);
	}

	return (
		<>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerAddIdea}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.viewAddIdea}>
						<Text style={styles.titleAddIdea}>Add a Gift Idea</Text>
						<TextInput style={styles.inputAddIdea} placeholder="Gift Idea" value={text} onChangeText={setText} />
						{image ? (
							<Image source={{ uri: image }} style={[styles.imageAddIdea, { width: imageWidth, height: imageHeight, marginBottom: 33 }]} />
						) : (
							<View style={styles.cameraContainer}>
								<CameraView style={styles.camera} facing={facing} ref={cameraRef}>
									<View style={styles.buttonContainerCam}>
										<TouchableOpacity style={styles.buttonCam} onPress={() => takePicture(cameraRef, setImage, setPictureSize)}>
											<Text style={styles.modalButtonText}>Take Picture</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.buttonCam} onPress={() => flipCamera(facing, setFacing)}>
											<Text style={styles.modalButtonText}>Flip Camera</Text>
										</TouchableOpacity>
									</View>
								</CameraView>
							</View>
						)}
						<TouchableOpacity style={styles.buttonAddIdea} onPress={() => saveIdea(personId, text, image, imageWidth, imageHeight, navigation, setShowModal, setModalMessage)}>
							<Text style={styles.buttonTextAddIdea}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.buttonAddIdea, { backgroundColor: '#FF0000' }]} onPress={() => navigation.navigate("IdeaScreen", { personId })}>
							<Text style={styles.buttonTextAddIdea}>Cancel</Text>
						</TouchableOpacity>

						{/* Custom Modal for alerts */}
						<CustomModal visible={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</>
	);
};



const styles = StyleSheet.create({
    viewAddIdea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dcdcdc",
        padding: 22,
    },

    titleAddIdea: {
        marginBottom: 22,
        color: "black",
        fontSize: 24,
        fontWeight: "bold",
    },
    containerAddIdea: {
		flex: 1
	},

    inputAddIdea: {
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 20,
        borderWidth:2,
        backgroundColor: "#fff",
        width: "100%",
        padding: 14,

    },
    imageAddIdea: {
        borderRadius: 12,
		resizeMode: "cover",
    },
    buttonAddIdea: {
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#007BFF",
    },
    buttonTextAddIdea: {
        fontWeight: "bold",
        color: "#fff",
        fontSize: 17,
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

	camera: {
		flex: 1
	},

	cameraContainer: {
		width: "100%",
        flex: 1 / 1,
		marginBottom: 22,
	},

	buttonContainerCam: {
        paddingBottom: 15,
		gap: 50,
        flex: 1,
		flexDirection: "row",
		display: "flex",
		alignItems: "flex-end",
        alignSelf: "center",

	},
	buttonCam: {
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#056608"
	},
});

export default AddIdeaScreen;
