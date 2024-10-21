import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
} from "react-native";
import { GlobalContext } from "../GlobalContext";

export const IdeaScreen = ({ route, navigation }) => {
  const { personId } = route.params;
  const { people, deleteIdea } = useContext(GlobalContext);
  const person = people.find((p) => p.id === personId);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);

  const handleDeleteIdea = () => {
    deleteIdea(personId, selectedIdeaId);
    setDeleteConfirmationVisible(false);
  };

  const renderIdeaItem = ({ item }) => (
    <View style={styles.ideaContainer}>
      {item.img && (
        <TouchableOpacity onPress={() => handleImagePress(item.img)}>
          <Image source={{ uri: item.img }} style={styles.image} />
        </TouchableOpacity>
      )}
      <View style={styles.textAndDeleteContainer}>
        <Text style={styles.ideaText}>{item.text}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setSelectedIdeaId(item.id);
            setDeleteConfirmationVisible(true);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Idea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleImagePress = (imgUri) => {
    setSelectedImage(imgUri);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ideas for {person.name}</Text>
      {person.ideas.length === 0 ? (
        <Text style={styles.emptyText}>No ideas added yet!</Text>
      ) : (
        <FlatList
          data={person.ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderIdeaItem}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddIdeaScreen", { personId })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Full Image View */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmationVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmationVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this idea?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setDeleteConfirmationVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButtonModal]}
                onPress={handleDeleteIdea}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 20,
    color: "grey",
    textAlign: "center",
    marginTop: 44,
  },
  ideaContainer: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    resizeMode: "cover",
    marginRight: 15,
  },
  textAndDeleteContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  ideaText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10, // Reduced padding to make the button smaller
    borderRadius: 10,
    alignItems: "center",

},
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007BFF",
    width: 50, // Smaller button size
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
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

export default IdeaScreen;
