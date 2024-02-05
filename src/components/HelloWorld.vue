<script>

export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';
    script.async = true;
    script.onload = () => {
      this.useMediaPipe();
    };
    document.body.appendChild(script);
  },
  methods: {
    async useMediaPipe() {
      const vision = window['@mediapipe/tasks-vision'];
      const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

      console.log('this', this);
      console.log('FaceLandmarker', this.FaceLandmarker);




    }

  }
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
