import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UFProps {
  value: string;
  label: string;
}
[];

interface CityProps {
  value: string;
  label: string;
}
[];

const Home = () => {
  const [ufs, setUfs] = useState<UFProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const ibgeURL = axios.create({
    baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
  });

  useEffect(() => {
    async function loadUfs() {
      const response = await ibgeURL.get<IBGEUFResponse[]>("/");

      const ufInitials = response.data.map((uf) => {
        return {
          value: uf.sigla,
          label: uf.nome,
        };
      });

      setUfs(ufInitials);
    }

    loadUfs();
  });

  useEffect(() => {
    async function loadCities() {
      const response = await ibgeURL.get<IBGECityResponse[]>(
        `${selectedUf}/municipios`
      );

      const citiesResponse = response.data.map((city) => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities(citiesResponse);
    }

    if (selectedUf !== "0") {
      loadCities();
    }
  }, [selectedUf]);

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      city: selectedCity,
      uf: selectedUf,
    });
  }

  function handleSelectUf(value: string) {
    setSelectedUf(value);
    setSelectedCity("0");
  }

  function handleSelectCity(value: string) {
    setSelectedCity(value);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de formas eficiente.
          </Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            onValueChange={handleSelectUf}
            items={ufs}
            placeholder={{ label: "Selecione um estado", value: 0 }}
            style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputIOS }}
          />

          <RNPickerSelect
            onValueChange={handleSelectCity}
            items={cities}
            placeholder={{ label: "Selecione uma cidade", value: 0 }}
            disabled={cities.length > 0 ? false : true}
            style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputIOS }}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
