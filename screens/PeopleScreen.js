import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";  
import Octicons from "@expo/vector-icons/Octicons";
import React, {useContext, useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View, StyleSheet, Pressable, Modal} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {GlobalContext} from "GlobalContext";

export const PeopleScreen = ({navigation}) => {
  const {people, deletePerson} = useContext(GlobalContext);
  const [sortedPeople, setSortedPeople] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);


  useEffect(() => {
    const sorted = [...people].sort((a, b) => new Date(a.dob) - new Date(b.dob));
    setSortedPeople(sorted);
  }, [people]);

  const openDeleteModal = (id) => {
    setSelectedPersonId(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    deletePerson(selectedPersonId);
    setModalVisible(false);
  };

  const renderRightActions = (id) => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => openDeleteModal(id)} 
    >
      <FontAwesome6 name="trash" size={24} color="white" />
    </Pressable>
  );

  return (
    <View style={styles.containerPeople}>
      {people.length === 0 ? (
        <Text style={styles.messagePeople}>No people added! Please add a person to get started.</Text>
      ) : (
        <FlatList
          data={sortedPeople}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <View style={styles.containerPeople}>
                <TouchableOpacity
                  style={styles.itemContainerPeople}
                  onPress={() => navigation.navigate("IdeaScreen", {personId: item.id})}
                >
                  <Octicons name="feed-person" size={40} color="grey" />
                  <View style={styles.textContainerPeople}>
                    <Text style={styles.namePeople}>{item.name}</Text>
                    <Text style={styles.dobPeople}>
                      {new Date(item.dob).toLocaleDateString(undefined, {
						year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || "Invalid date"}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="lightbulb"
                    size={40}
                    color="#007FFF"
                    onPress={() =>
                      navigation.navigate("IdeaScreen", {
                        personId: item.id,
                      })
                    }
                  />
                </TouchableOpacity>
              </View>
            </Swipeable>
          )}
        />
      )}

      {/* Floating Action Button */}
	  	<Pressable
  			style={styles.addPersonButton}
  			onPress={() => navigation.navigate("AddPersonScreen")} 
			>
  			<FontAwesome6 name="plus" size={24} color="white" />
		</Pressable>

      {/* Custom Modal for Delete Confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this person?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.deleteButtonModal]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};


const styles = StyleSheet.create({
  containerPeople: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messagePeople: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 20,
    color: "#6c757d",
  },
  itemContainerPeople: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.88,
    elevation: 6,
  },
  namePeople: {
    fontSize: 19,
    textAlign: "left",
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 5,
  },
  dobPeople: {
    color: "#6c757d",
    fontSize: 17,
    textAlign: "left",
  },
  textContainerPeople: {
    flex: 1,
    marginHorizontal: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d10000",
    width: 80,
    borderRadius: 10,
    marginVertical: 10,
    marginRight: 5,
  },
  addPersonButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    borderRadius: 30,
    backgroundColor: "#007FFF",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    elevation: 5,
  },


  //Pop up modal styles:
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    marginRight: 10,
  },
  deleteButtonModal: {
    backgroundColor: "#d10000",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PeopleScreen;
