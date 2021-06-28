<template>
  <div id="app">
    <div class="user">
      Welcome <b>{{ user }}</b>
      <p><b>Stats:</b></p>
      <p>Bending Angle: {{ Math.floor(result.bending) }}°</p>
      <p>Left Momentum: {{ result.leftMomentum }}</p>
      <p>Right Momentum: {{ result.rightMomentum }}</p>
    </div>
    <div class="controllers">
      <div class="start" @click="start()">Start</div>
      <div class="stop" @click="stop()">Stop</div>
      <div class="new" @click="newObj()">Get New Object</div>
    </div>
    <stick />
    <div class="dimensions">
      <div class="left-dimension">
        <insider
          v-for="leftObject in leftObjects"
          :is="leftObject.type"
          :key="leftObject.id"
          :weight="leftObject.weight"
          :posx="leftObject.posx"
          :posy="leftObject.posy"
          :color="leftObject.color"
        />
      </div>
      <div class="right-dimension">
        <insider
          v-for="rightObject in rightObjects"
          :is="rightObject.type"
          :key="rightObject.id"
          :weight="rightObject.weight"
          :posx="rightObject.posx"
          :posy="rightObject.posy"
          :color="rightObject.color"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Stick from "./components/Stick.vue";
import InsiderCircle from "./components/Circle.vue";
import InsiderRectangle from "./components/Rectangle.vue";
import InsiderTriangle from "./components/Triangle.vue";
import helpers from "./helpers/";

export default {
  name: "App",
  components: {
    Stick,
    InsiderCircle,
    InsiderRectangle,
    InsiderTriangle,
  },
  created() {
    let bendingAngle;
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case "calculate":
          if (this.calculate) {
            this.newObj();
            this.$store.commit("calculate", false);
          }
          break;
        case "setObjectPositions":
          bendingAngle = helpers.calculateBendAngle(this.objects);
          if (
            bendingAngle.bending >= 30 ||
            bendingAngle.bending <= -30 ||
            bendingAngle.leftMomentum - bendingAngle.rightMomentum >= 20 ||
            bendingAngle.rightMomentum - bendingAngle.leftMomentum >= 20
          ) {
            // reset simulation
            setTimeout(() => {
              alert("Try Again");
              this.$store.commit("resetStore");
              document
                .querySelectorAll(".circle, .rectangle, .triangle")
                .forEach((e) => {
                  e.remove();
                });
            }, 600);
          } else {
            // set new result
            this.$store.commit("setResult", bendingAngle);
            document.querySelector(
              ".dimensions"
            ).style.transform = `rotate(${bendingAngle.bending}deg)`;
            document.querySelector(
              ".stick"
            ).style.transform = `rotate(${bendingAngle.bending}deg)`;
          }
          break;
      }
    });
  },
  data: function () {
    return {
      leftObjects: [],
      rightObjects: [],
    };
  },
  computed: mapState({
    turn: (state) => state.turn,
    user: (state) => state.user,
    calculate: (state) => state.shouldCalculate,
    objects: (state) => state.objects,
    result: (state) => state.result,
  }),
  methods: {
    generateRandomWeight: function () {
      return Math.floor(Math.random() * 10) + 1; // 1 - 10
    },
    generateRandomPosX: function () {
      return Math.floor(Math.random() * 5); // 0 - 4
    },
    generateRandomPosY: function () {
      return Math.floor(Math.random() * 8); // 0 - 8
    },
    generateRandomColor: function () {
      return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    },
    decideObjectType: function () {
      let objects = ["insider-circle", "insider-rectangle", "insider-triangle"];
      return objects[Math.floor(Math.random() * 3)];
    },
    start: function () {
      this.$store.commit("start");
    },
    stop: function () {
      this.$store.commit("stop");
    },
    newObj: function () {
      let id = this.rightObjects[this.rightObjects.length - 1].id + 1;
      if (this.turn === "right") {
        this.rightObjects.push({
          id,
          type: this.decideObjectType(),
          weight: this.generateRandomWeight(),
          posx: this.generateRandomPosX(),
          posy: this.generateRandomPosX(),
          color: this.generateRandomColor(),
        });
        this.$store.commit("updateTurn", "left");
      } else if (this.turn === "left") {
        this.leftObjects.push({
          id: id || 0,
          type: this.decideObjectType(),
          weight: this.generateRandomWeight(),
          posx: this.generateRandomPosX(),
          posy: this.generateRandomPosX(),
          color: this.generateRandomColor(),
        });
        this.$store.commit("updateTurn", "right");
      }
    },
  },
  beforeMount: function () {
    this.rightObjects.push({
      id: 1,
      type: this.decideObjectType(),
      weight: this.generateRandomWeight(),
      posx: this.generateRandomPosX(),
      posy: this.generateRandomPosX(),
      color: this.generateRandomColor(),
    });
    this.$store.commit("updateTurn", "left");
  },
  mounted: function () {
    let user = prompt("Please enter your name", "Insider");
    this.$store.commit("saveUser", user);
  },
  updated: function () {},
};
</script>

<style>
html,
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#app {
  color: #2c3e50;
  width: 1100px;
  margin: 0 auto;
  display: block;
  background: rgb(235, 235, 235);
  height: 100vh;
  padding: 0;
  position: relative;
}

.dimensions {
  width: 1000px;
  height: 30px;
  height: 100vh;
  margin: auto;
  display: flex;
  transform-origin: bottom;
}

.dimensions > div {
  flex: 1;
  position: relative;
}

.controllers {
  position: absolute;
  right: 0;
}

.controllers > div {
  display: inline-block;
  position: relative;
  z-index: 9;
}

.start {
  color: white;
  background: yellowgreen;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  margin-right: 5px;
  cursor: pointer;
}

.stop {
  color: white;
  background: indianred;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  margin-right: 5px;
  cursor: pointer;
}

.new {
  color: white;
  background: blueviolet;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  cursor: pointer;
}

.user {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 22px;
  border: 1px solid rgba(128, 128, 128, 0.425);
  padding: 10px;
}
</style>
