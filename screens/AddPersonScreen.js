import React, {useContext, useState} from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Modal
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import {GlobalContext} from "GlobalContext";

export const AddPersonScreen = ({navigation}) => {
	const {addPerson} = useContext(GlobalContext);
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState(""); // Store error message

	const savePerson = (name, date, addPerson, navigation) => {
		if (name && date) {
			const [year, month, day] = date.split("/");
			const formattedDate = `${year}-${month}-${day}`;
			const currentDate = new Date(formattedDate);

			if (!isNaN(currentDate.getTime())) {
				addPerson(name, currentDate.toISOString());
				navigation.navigate("PeopleScreen");
			} else {
				setModalMessage("Please select a valid date.");
				setModalVisible(true); 
			}
		} else {
			setModalMessage("Please fill all fields.");
			setModalVisible(true); 
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.containerAddPerson}
			behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.viewAddPerson}>
					<Text style={styles.labelAddPerson}>Person Name:</Text>
					<TextInput
						style={styles.inputAddPerson}
						placeholder="Type the name"
						value={name}
						onChangeText={setName}
					/>

					<Text style={styles.labelAddPerson}>Date of Birth:</Text>
					<DatePicker
						mode="calendar"
						onDateChange={setDate}
						style={styles.datePickerAddPerson}
					/>

					<TouchableOpacity
						style={styles.buttonAddIdea}
						onPress={() => savePerson(name, date, addPerson, navigation)}>
						<Text style={styles.buttonTextAddIdea}>Save</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.deleteButtonIdea}
						onPress={() => navigation.navigate("PeopleScreen")}>
						<Text style={styles.deleteButtonTextIdea}>Cancel</Text>
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
									onPress={() => setModalVisible(false)}>
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

export const styles = StyleSheet.create({
	viewAddPerson: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5"
	},
	containerAddPerson: {
		flex: 1
	},
	labelAddPerson: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333"
	},
	inputAddPerson: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		padding: 10,
		marginBottom: 20,
		backgroundColor: "#fff"
	},
	deleteButtonTextIdea: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
	},
	deleteButtonIdea: {
		backgroundColor: "red",
		padding: 15,
		borderRadius: 10,
		alignItems: "center"
	},
	buttonTextAddIdea: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold"
	},
	buttonAddIdea: {
		backgroundColor: "green",
		padding: 15,
		borderRadius: 10,
		width: "100%",
		alignItems: "center",
		marginBottom: 12,
		marginTop: 20
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	},
	modalContainer: {
		width: 300,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center"
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10
	},
	modalMessage: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20
	},
	modalButton: {
		backgroundColor: "#007BFF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10
	},
	modalButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold"
	}
});
