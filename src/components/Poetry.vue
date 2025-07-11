<template>
  <div ref="backgroundContainer" :style="gradientBackground" class="background">
    <svg viewBox="0 0 1000 250" style="margin-bottom: -18px">
      <text x="0" y="100" font-size="85" :style="{ fontFamily: dominantFont }">
        Selected Works of
      </text>
      <text x="0" y="200" font-size="85" :style="{ fontFamily: dominantFont }">
        Gaius Valerius Catullus
      </text>
    </svg>
    <hr />
    <p class="credits">
      <span class="sans">Interpreted by: Daniel Lavery (2018) - </span>
      <span class="serif">Frank O. Copley (1957)</span>
      <span class="extra-serif"> - Richard Burton (1894).</span>
    </p>
    <p class="toc" :class="poetry[0].styles[Number(whichVersion)]">
      Contents:
      <template v-for="(poem, i) in poetry" :key="poem.title">
        <a :href="'#' + poem.title">{{ poem.title }}</a
        >{{ i == poetry.length - 1 ? "" : " " }}</template
      >
    </p>
    <hr />
    <template v-for="poem in poetry" :key="poem.title">
      <h2 :class="poem.styles[Number(!whichVersion)]" :id="poem.title">{{ poem.title }}</h2>
      <div
        class="fullPoem"
        @mousemove="updatePointerPos"
        @click="updatePointerPos"
        @mouseenter.self="gradientActive = true"
        @mouseleave="gradientActive = false"
        @touchstart="gradientActive = true"
        @touchmove.prevent="updatePointerPos"
      >
        <template v-for="(line, i) in poem.lines">
          <template v-for="subLine in line.split('\n')" :key="subLine">
            <p
              class="poetryLine"
              :class="poem.styles[i % 2]"
              :style="styleText(i % 2)"
              v-html="smartquotes(subLine)"
            />
          </template>
        </template>
      </div>
    </template>
    <div
      ref="quote"
      :style="{
        background: 'white',
        fontFamily: 'Crimson Pro, serif',
        margin: '25px 0',
        color: '#656565',
      }"
    >
      <p>
        Around 1916, I decided to devote myself to the study of Oriental literatures. Working with
        enthusiasm and credulity through the English version of a certain Chinese philosopher, I
        came across this memorable passage: "A man condemned to death doesn't care that he is
        standing at the edge of a precipice, for he has already renounced life."
      </p>

      <p>
        Here the translator attached an asterisk, and his note informed me that this interpretation
        was preferable to that of a rival Sinologist, who had translated the passage thus: "The
        servants destroy the works of art, so that they will not have to judge their beauties and
        defects."
      </p>
      <p>
        Then, like Paolo and Francesca, I read no more. A mysterious skepticism had slipped into my
        soul.
      </p>
      — Borges
    </div>
  </div>
  <div id="gutter" @click="gradientActive = false">
    <div id="toggle">
      <label class="switch">
        <input type="checkbox" checked v-model="whichVersion" />
        <span class="slider"></span>
      </label>
    </div>
    <svg id="scrolly">
      <defs>
        <linearGradient id="fadeIn" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="white" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="fadeOut" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="white" stop-opacity="0" />
          <stop offset="100%" stop-color="white" />
        </linearGradient>
        <linearGradient id="ridge" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="#ccc" />
          <stop offset="100%" stop-color="#333" />
        </linearGradient>
      </defs>
      <rect
        v-for="i in 25"
        :key="i"
        x="0px"
        width="30px"
        :y="i * 20 - (scrollPos % 20) + 'px'"
        height="4px"
        fill="url(#ridge)"
        ry="2px"
      />
      <rect x="0" y="0" width="40px" height="30px" fill="url(#fadeIn)" />
      <rect x="0" y="470px" width="40px" height="30px" fill="url(#fadeOut)" />
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import poetry from "../assets/lines.json";
import smartquotes from "smartquotes";

const whichVersion = ref(true);
const gradientActive = ref(false);
const mousePosPercent = ref(0);
const backgroundContainer = ref(null);
const scrollPos = ref(0);

window.addEventListener("scroll", () => {
  scrollPos.value = window.scrollY;
});

watch(whichVersion, () => {
  gradientActive.value = false;
});

const makeGradient = (centerPos) =>
  `linear-gradient(white -10%, ` +
  `white calc(${centerPos}% - 80px), ` +
  `black calc(${centerPos}% - 40px), ` +
  `black ${centerPos}%, ` +
  `black calc(${centerPos}% + 40px), ` +
  `white calc(${centerPos}% + 80px), ` +
  `white 110%)`;
const gradientBackground = computed(() => {
  if (gradientActive.value) {
    return { backgroundImage: makeGradient(mousePosPercent.value) };
  } else {
    return { backgroundColor: "white" };
  }
});

const updatePointerPos = (event) => {
  if (!backgroundContainer.value) {
    return;
  }
  const box = backgroundContainer.value.getBoundingClientRect();
  const eventY = event.clientY || event.touches[0].clientY;
  mousePosPercent.value = ((eventY - box.top) / box.height) * 100;
};

const styleText = (zeroOrOne) => ({
  color: whichVersion.value == !!zeroOrOne ? "rgba(1,1,1,0.15)" : "black",
});

const dominantFont = computed(() => (whichVersion.value ? "Crimson Pro" : "OpenSauceOne"));

const quote = ref(null);
watch(quote, () => {
  if (quote.value) {
    smartquotes(quote.value);
  }
});
</script>

<style lang="scss">
@use "sass:math";

@font-face {
  font-family: "OpenSauceOne";
  src: url("../../public/fonts/opensauceone-regular-webfont.woff2") format("woff2"),
    url("../../public/fonts/opensauceone-regular-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Kontrapunkt Light";
  src: url("../../public/fonts/Kontrapunkt-Light.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro&display=swap");

html {
  font-size: 16px;
  @media (max-width: 700px) {
    font-size: 12px;
  }
}

body {
  margin: 0;
}

hr {
  margin: 10px 0;
}

a {
  color: black;
}

p {
  margin: 16px 0; // keep margins from being based on font size
}

$serif-scale-factor: 1.2;
.serif {
  font-family: "Crimson Pro";
}

$sans-scale-factor: 0.95;
.sans {
  font-family: "OpenSauceOne";
}

$extra-serif-scale-factor: 1.1;
.extra-serif {
  font-family: "Kontrapunkt Light";
}

h2 {
  font-weight: normal;
  font-style: italic;
  height: 1.6rem;
  margin: 15px 0;
  &.serif {
    font-size: 1.4rem * $serif-scale-factor;
  }
  &.sans {
    font-size: 1.4rem * $sans-scale-factor;
  }
  &.extra-serif {
    font-size: 1.4rem * $extra-serif-scale-factor;
  }
}

.poetryLine {
  margin: 6px 0;
  transition: color 0.25s;
  line-height: 1.5;
  white-space: pre-wrap;
  &.serif {
    font-size: 1rem * $serif-scale-factor;
  }
  &.sans {
    font-size: 1rem * $sans-scale-factor;
  }
  &.extra-serif {
    font-size: 1rem * $extra-serif-scale-factor;
  }
}

.credits {
  .serif {
    font-size: 1.1rem * $serif-scale-factor;
  }
  .sans {
    font-size: 1.1rem * $sans-scale-factor;
  }
  .extra-serif {
    font-size: 1.1rem * $extra-serif-scale-factor;
  }
}

.toc {
  line-height: 1.25rem;
  &.serif {
    font-size: 1rem * $serif-scale-factor;
  }
  &.sans {
    font-size: 1rem * $sans-scale-factor;
  }
  &.extra-serif {
    font-size: 1rem * $extra-serif-scale-factor;
  }
}

.credits,
.toc {
  margin: 10px 0;
}

.background {
  width: 50%;
  max-width: 715px;
  padding: 5px;
  background-clip: text;
  -webkit-background-clip: text;
  @media (max-width: 700px) {
    width: 85%;
    max-width: unset;
  }
}

#toggle {
  position: fixed;
  top: 100px;
  left: 75%;
  @media (max-width: 700px) {
    top: 30px;
    left: unset;
    right: 5px;
  }
}

#gutter {
  @media (max-width: 700px) {
    width: 50px;
  }
}

#scrolly {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 500px;
  @media (min-width: 700px) {
    display: none;
  }
}

#app {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  @media (max-width: 700px) {
    align-items: stretch;
  }
}

// https://www.w3schools.com/howto/howto_css_switch.asp

$switch-width: 40px;
$switch-height: 23px;
$toggle-indicator-diameter: 18px;

.switch {
  position: relative;
  display: inline-block;
  width: $switch-width;
  height: $switch-height;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: $switch-height;
}

.slider:before {
  position: absolute;
  content: "";
  height: $toggle-indicator-diameter;
  width: $toggle-indicator-diameter;
  left: math.div($switch-width - $toggle-indicator-diameter * 2, 2);
  bottom: math.div(($switch-height - $toggle-indicator-diameter), 2);
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #787878;
}

input:focus + .slider {
  box-shadow: 0 0 1px #787878;
}

input:checked + .slider:before {
  -webkit-transform: translateX($toggle-indicator-diameter);
  -ms-transform: translateX($toggle-indicator-diameter);
  transform: translateX($toggle-indicator-diameter);
}
</style>
