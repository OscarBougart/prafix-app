import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          title: "Profil",
          headerStyle: { backgroundColor: "#001d3d" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Animated.View entering={FadeIn.duration(400)} style={S.container}>
        <Text style={S.title}>Profil</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#001d3d",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 48,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
});
