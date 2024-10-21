import PeopleProvider from "GlobalContext";
import { StackNavigator } from "StackNavigator";
import React from 'react';



export default function App() {
  return (
    <PeopleProvider>
      	<StackNavigator />
    </PeopleProvider>
  );
}
