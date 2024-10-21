import { AddPersonScreen } from "screens/AddPersonScreen";
import { IdeaScreen } from "screens/IdeaScreen";
import { PeopleScreen } from "screens/PeopleScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text } from "react-native";
import { AddIdeaScreen } from "screens/AddIdeaScreen";


const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PeopleScreen">
        <Stack.Screen
          name="PeopleScreen"
          component={PeopleScreen}
          options={({ navigation }) => ({
            headerTitleAlign: "left",
            headerTitle: "People",
            headerTitleStyle: {
            fontSize: 22,
            },
            headerRightContainerStyle: {
              right: 16,
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddPersonScreen")}
                style={{
                  backgroundColor: "#007BFF", 
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10, 
                }}
              >
                
                <Text style={{ color: "white", fontWeight: "bold", fontSize:16}}>Add Person</Text>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="AddPersonScreen"
          component={AddPersonScreen}
          options={{
            headerTitle: "Add Person",
            headerTitleStyle: {
              fontSize: 22,
            },
			headerTintColor: "black",
            headerLeftContainerStyle: {
              left: 8,
            },
          }}
        />

        <Stack.Screen
          name="IdeaScreen"
          component={IdeaScreen}
          options={({ route, navigation }) => {
            const { personId } = route.params;
            return {
              headerTitle: "Ideas",
              headerTitleStyle: {
                fontSize: 22,
              },
              headerLeftContainerStyle: {
                left: 10,
              },
              headerRightContainerStyle: {
                right: 20,
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddIdeaScreen", { personId })}
                  style={{
					          backgroundColor: "#007BFF", 
                    borderRadius: 10, 
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize:16 }}>Add Idea</Text>
                </TouchableOpacity>
              ),
            };
          }}
        />

        <Stack.Screen
          name="AddIdeaScreen"
          component={AddIdeaScreen}
          options={{
            headerTitle: "Add Idea",
            headerTitleStyle: {
              fontSize: 22,
            },
            headerLeftContainerStyle: {
              left: 12,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
