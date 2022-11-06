// import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "@/api";

export const useGamesTopCriticsStore = defineStore("gamesTopCritics", {
  state: () => ({
    games: [],
  }),

  actions: {
    async fetchGames() {
      axios
        .get(API_URL, {
          params: {
            ordering: "-metacritic",
            platforms: "1",
            page_size: "10",
            exclude_additions: "true",
            dates: "2020-01-01,2022-11-01",
          },
        })
        .then((response) => {
          this.games = response.data.results;
          console.log(this.games);
        });
    },
  },
});
