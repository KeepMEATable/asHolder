<template>
  <div class="home">
    <qrcode-stream @decode="onDecode">
      <b>Please scan A QrCode to add it to your queue.</b>
    </qrcode-stream>
    <h1>HERE</h1>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { QrcodeStream } from 'vue-qrcode-reader';

@Component({
  components: {
    QrcodeStream,
  },
})
export default class Home extends Vue {
  onDecode(decodedString) {
    this.$store.dispatch('flash', decodedString);
  }
}
</script>
