<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.0"
         ref="playSVG"
         width="16px"
         height="16px"
         viewBox="0 0 200 200"
         preserveAspectRatio="xMidYMid meet">
      <g :transform="transform">
        <path :fill="stroke"
              d="M185 443 c-42 -22 -65 -43 -83 -78 -44 -86 -33 -175 32 -240 82 -82 200 -82 282 0 96 96 73 255 -46 315 -48 25 -142 26 -185 3z">
          <animate attributeType="CSS" attributeName="opacity" from="1" to="0" begin="0.33s" dur="1s" repeatCount="indefinite" />
        </path>
        <path :fill="stroke"
              d="M70 841 l0 -101 28 0 c79 -1 192 -32 280 -75 131 -65 232 -166 297 -297 43 -88 74 -201 75 -280 l0 -28 101 0 102 0 -7 79 c-35 421 -370 756 -798 796 l-78 7 0 -101z">
          <animate attributeType="CSS" attributeName="opacity" from="1" to="0" begin="0.66s" dur="1s" repeatCount="indefinite" />
        </path>
        <path :fill="stroke"
              d="M72 1213 l3 -98 91 -7 c218 -17 392 -87 569 -229 224 -180 362 -441 383 -719 l7 -95 100 0 100 0 -3 80 c-5 104 -35 254 -73 358 -100 278 -349 552 -622 685 -153 75 -341 122 -489 122 l-69 0 3 -97z">
          <animate attributeType="CSS" attributeName="opacity" from="1" to="0" begin="0.99s" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  </div>
</template>
<script>
const RIGHT_TRANSFORM = 'translate(175,100) scale(0.1,-0.1) rotate(135)'
const LEFT_TRANSFORM = 'translate(0,100) scale(0.1,-0.1) rotate(-45)'

export default {
  name: 'voiceplay',
  components: {},
  props: {
    'stroke': {
      type: String,
      default: () => '#333'
    },
    'direct': {
      type: String,
      default: () => 'left'
    }
  },
  data () {
    return {

    }
  },
  computed: {
    transform () {
      return this.direct === 'left' ? LEFT_TRANSFORM : RIGHT_TRANSFORM
    }
  },
  methods: {
    startAnimate () {
      this.$refs.playSVG.unpauseAnimations()
    },
    stopAnimate () {
      this.$refs.playSVG.pauseAnimations()
    },
  },
  mounted () {
    this.stopAnimate()
  }
}
</script>
