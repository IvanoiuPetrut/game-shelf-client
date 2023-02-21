import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "@/api";

export const useGamesMostPopularStore = defineStore("MostPopular", {
  state: () => ({
    games: [],
  }),

  actions: {
    async fetchGames() {
      axios
        .get(`${API_URL}/games`, {
          params: {
            ordering: "-rating",
            platforms: "1",
            page_size: "10",
            exclude_additions: "true",
            // dates: "2019-01-01,2099-11-01",
          },
        })
        .then((response) => {
          this.games = response.data.results;
        });
    },
  },
});
