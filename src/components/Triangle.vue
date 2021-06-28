<template>
  <div
    class="triangle"
    :style="renderObj(state_weight, state_posx, state_posy)"
  >
    <span>{{ weight }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "InsiderTriangle",
  props: {
    weight: Number,
    posx: Number,
    posy: Number,
    color: String,
  },
  methods: {
    calculateSize: function (size) {
      return `transform: scale(${Math.sqrt(size) / 2.2});`;
    },
    calculatePosition: function (posx, posy) {
      return `left: ${posx * 100}px; top: ${posy * 100}px;`;
    },
    renderObj: function (size, posx, posy) {
      return (
        this.calculateSize(size) +
        this.calculatePosition(posx, posy) +
        `border-bottom-color: ${this.color}`
      );
    },
    moveObj: function ({ keyCode }) {
      if (keyCode === 37) {
        // left
        if (this.state_posx > 0) {
          this.state_posx--;
        }
      } else if (keyCode) {
        // right
        if (this.state_posx < 4) {
          this.state_posx++;
        }
      }
    },
  },
  data: function () {
    return {
      state_weight: this.weight,
      state_posx: this.posx,
      state_posy: this.posy,
      state_angle: this.$store.state.result.bending,
    };
  },
  created() {
    if (this.turn === "right" && this.$data.state_posy < 7) {
      window.addEventListener("keydown", this.moveObj);
    }
  },
  computed: mapState({
    isStarted: (state) => state.isStarted,
    calculate: (state) => state.shouldCalculate,
    turn: (state) => state.turn,
    result: (state) => state.result,
    objects: (state) => state.objects,
  }),
  mounted: function () {
    let draw = setInterval(() => {
      if (this.$data.state_posy < 7 && this.isStarted) {
        this.$data.state_posy++;
      } else if (this.$data.state_posy === 7) {
        this.$store.commit("calculate", true);
        clearInterval(draw);
      }
    }, 700);
  },
  updated: function () {
    if (this.$data.state_posy === 7) {
      window.removeEventListener("keydown", this.moveObj);
      this.$destroy();
    }
  },
  destroyed() {
    this.$store.commit("calculate", false);
    this.$store.commit("setObjectPositions", {
      posx: this.state_posx,
      weight: this.weight,
      position: this.turn === "right" ? "left" : "right",
    });
  },
};
</script>

<style scoped>
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 50px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center bottom;
  transition: 1s ease all;
}

.triangle span {
  margin-top: 60px;
}
</style>