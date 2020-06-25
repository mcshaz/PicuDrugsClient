<template>
<div>
  <b-jumbotron header="404" lead="Sorry, page not found" bg-variant="warning" text-variant="dark" class="mt-3">
    <hr class="my-4">
    <p>
      Unofrtunately the page <em>{{ notFoundPath }}</em> cannot be found.
    </p>
  </b-jumbotron>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BJumbotron } from 'bootstrap-vue';

@Component({
  components: { BJumbotron },
})
export default class NotFound extends Vue {
  public get notFoundPath() {
    return this.$route.query?.path
      ? this.$route.query.path
      : window.location.href;
  }
}
</script>
