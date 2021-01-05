<template>
  <v-row>
    <v-col cols="8">
      <markdown
        ref="markdown"
        class="markdown ml-10"
        :source="source"
        toc
        toc-anchor-link-symbol="#"
      ></markdown>
    </v-col>
    <v-col>
      <div class="guider mx-10">
        <div class="title desc--text d-flex align-center">
          <v-icon class="mr-3">list</v-icon>
          <span>Contents</span>
        </div>
        <a
          v-for="(item,i) in guide"
          :key="i"
          class="desc--text mb-2"
          :href="'#'+item.id"
          :class="{
          'mt-5': item.tag==='H2',
          'ml-5': item.tag==='H4',
        }"
        >{{item.title}}</a>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// @ts-ignore
import Markdown from 'vue-markdown'

@Component({
  components: {
    Markdown
  }
})
export default class Help extends Vue {
  guide: any[] = []
  source = require('./faq.md').default
  async mounted() {
    this.$nextTick()
    // @ts-ignore
    const markdownEl = this.$refs.markdown.$el
    const allTitle = new Array(...markdownEl.children)
      .filter(item => item.tagName.startsWith('H'))
      .map(item => ({
        tag: item.tagName,
        id: item.id,
        title: item.textContent.replace('#', '').trim()
      }))
    this.guide = allTitle
  }
}
</script>
<style lang="less" scoped>
.guider {
  position: fixed;
  max-height: 80vh;
  overflow-y: auto;
  a {
    display: block;
    text-decoration: underline;
    text-decoration-color: lightgrey;
  }
}
</style>
<style lang="less" >
@desc: #565f6c;
@mark: #13b5b1;

.markdown {
  & > *:target {
    animation: 1s bounceIn;
  }
  h2 {
    margin-bottom: 30px;
  }
  hr {
    margin: 30px 0px;
    border-top-color: rgba(0, 0, 0, 0.1);
  }
  h4 {
    margin-bottom: 15px;
  }
  p,
  li {
    color: @desc;
  }
  strong {
    color: @mark;
  }
  a {
    color: @desc;
  }
  .toc-anchor-link {
    font-size: 1rem;
    vertical-align: middle;
  }
}

@keyframes bounceIn {
  0% {
    background: #ff9d02;
  }
  100% {
    background: transparent;
  }
}
</style>