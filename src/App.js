import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  function random_item(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`);

    if(response.status === 204) {
      const filterRepositories = repositories.filter(repository => repository.id !== id);
      setRepositories(filterRepositories);
    }
  }

  async function handleAddRepository() {
    const namesRepositories = ['Desafio ReactJS', 'Desafio Nodejs', 'Desafio React Native', 'Desafio Docker', 'Desafio Expo', 'Desafio Sequelize'];
    const namesTechsFirst = ['ReactJS', 'React Native', '.Net Core', '.Net'];
    const namesTechsSecond = ['Mongoose', 'NodeJs', 'Adonis', 'Angular', 'Hooks', 'Redux'];
    
    const response = await api.post('/repositories', {
        title: random_item(namesRepositories),
        url: `${Date.now()}.com`,
        techs: [
          random_item(namesTechsFirst),
          random_item(namesTechsSecond)
        ]
    });

    const repository = response.data;
    setRepositories([... repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const likedRepository = response.data;
    
    const repositoriesUpdated = repositories.map(repository => {
      if (repository.id === id) {
        return likedRepository;
      } else {
        return repository;
      }
    });
    setRepositories(repositoriesUpdated);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{ repository.title }</Text>

              <View style={styles.techsContainer}>
                { repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                )) }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  { repository.likes } curtidas
                </Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonTextLike}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRemoveRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonTextRemove}>Remover</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          )}
        />
        <TouchableOpacity 
          style={styles.buttonAdd}
          activeOpacity={0.8}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonTextAdd}>Adicionar Repositórios</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 5
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-around",
    alignItems: 'center',
  },
  buttonTextLike: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#7159c1",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 37,
    paddingLeft: 37,
    borderRadius: 5,
    textAlign: 'center',
    flex: 1
  },
  buttonTextRemove: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#d9534f",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 5,
    textAlign: 'center',
    flex: 1,
  },
  buttonAdd: {
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTextAdd: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
