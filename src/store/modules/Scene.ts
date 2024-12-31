import { ref } from "vue";
import { Components } from "@/core";

const resetStore = () => {
  const componentList: Map<string, Components> = new Map();
  return {
    componentList,
  };
};
export const StoreScene = ref(resetStore());
