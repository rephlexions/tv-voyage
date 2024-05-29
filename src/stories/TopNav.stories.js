import TopNav from '../components/TopNav.vue'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
export default {
  title: 'TopNav',
  component: { TopNav, Input, Button, ChevronLeft },
  argTypes: {
    buttonType: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' }
    },
    disabled: false,
    backgroundColor: { control: 'color' }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { TopNav, Input, Button, ChevronLeft },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args }
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<TopNav  v-bind="args">Click me</TopNav>'
})

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'TopNav',
  buttonType: 'primary',
  disabled: true
}
export const Normal = Template.bind({})
Normal.args = {
  label: 'TopNav',
  buttonType: 'primary',
  disabled: false
}
