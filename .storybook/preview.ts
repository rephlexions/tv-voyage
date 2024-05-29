import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import TopNav from '../src/components/TopNav.vue'

setup((app) => {
  app.component('top-nav', TopNav)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
