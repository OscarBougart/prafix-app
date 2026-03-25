import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function RegelnScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={S.header}>
        <Pressable onPress={() => router.back()} style={S.backBtn} accessibilityRole="button" accessibilityLabel="Zurück">
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={S.title}>Regeln</Text>
        <View style={S.backBtn} />
      </View>
      <View style={S.body}>
        <Text style={S.placeholder}>Kommt bald.</Text>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#001d3d" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontFamily: "GravitasOne_400Regular", fontSize: 20, color: "#FFFFFF", textAlign: "center" },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: { fontFamily: "Nunito_400Regular", fontSize: 16, color: "#AFAFAF" },
});
