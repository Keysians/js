<script lang="tsx">
import Vue from 'vue'
import Component from 'vue-class-component'
// @ts-ignore
import TextField from 'vuetify/lib/components/VTextField'

export default Vue.component('number-input', {
  props: {
    ...TextField.options.props,
    type: {
      type: String,
      default: 'number'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: undefined
    },
    decimal: {
      type: Number,
      default: undefined
    }
  },
  methods: {
    input(v: string, t: any) {
      const value = parseFloat(v)
      let newValue
      if (value < this.$props.min) {
        newValue = this.$props.min.toString()
      } else if (value !== undefined && value > this.$props.max) {
        newValue = this.$props.max.toString()
      } else {
        newValue = v
      }
      this.$emit('input', newValue)
      // @ts-ignore
      this.$refs.input.lazyValue = newValue
    },
    validate(evt: any) {
      const theEvent = evt || window.event
      let key
      // Handle paste
      if (theEvent.type === 'paste') {
        key = evt.clipboardData.getData('text/plain')
      } else {
        // Handle key press
        key = theEvent.keyCode || theEvent.which
        key = String.fromCharCode(key)
      }
      let regex = /[0-9]|\./
      if (this.$props.decimal === 0) {
        regex = /[0-9]/
      }
      if (!regex.test(key)) {
        theEvent.returnValue = false
        if (theEvent.preventDefault) theEvent.preventDefault()
      }
    }
  },
  render(h) {
    return (
      <v-text-field
        ref="input"
        props={this.$props}
        oninput={this.input}
        onkeypress={this.validate}
      >
        {Object.keys(this.$slots).map(key => {
          return <template slot={key}>{this.$slots[key]}</template>
        })}
      </v-text-field>
    )
  }
})
</script>