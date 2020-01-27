<template>
  <div class="about">
    <p>
      The coding and maintenance of this project is the work of Starship Hospital intensivist
      <a href="mailtto:brentm@adhb.govt.nz">Brent McSharry</a>. It is hosted privately
      and independently of the Starship Foundation and Auckland District Health Board.
    </p>
    <p>
      Please contact Brent via the link above if you would like access to a drag and drop user interface
      (which allows you to create emergency bolus and/or infusion charts specific to your institution).
      <em>
        I would especially appreciate any requests or feedback as to how to improve the
        app for use in the South Pacific.
      </em>
    </p>
    <p>
      Special thanks go to the following people:
    </p>
    <dl>
      <dt>Dave Buckley &amp; Jenny Wright</dt>
      <dd>for help laying out the withdrawal chart</dd>
      <dt>Annabelle Toogood (NZ Air Ambulance)</dt>
      <dd>for providing flight times</dd>
    </dl>
    <p>
      Huge thanks also go to numerous Authors who have contributed to open source tools,
      without which this project would not be possible.
      These are too numerous to name, but are listed in the <a href="https://github.com/mcshaz/PicuDrugsClient/blob/master/package.json">GitHub pakage.json file</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class About extends Vue {
}
</script>
