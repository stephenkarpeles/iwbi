import { join } from 'path'

export default function () {
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push(
      {
        path: join(__dirname, 'components/elements/buttons'),
        prefix: 'W-Buttons',
      },
      {
        path: join(__dirname, 'components/elements/cards'),
        prefix: 'W-Cards',
      },
      {
        path: join(__dirname, 'components/elements/feedback'),
        prefix: 'W-Feedback',
      },
      {
        path: join(__dirname, 'components/elements/headings'),
        prefix: 'W-Headings',
      },
      {
        path: join(__dirname, 'components/elements/links'),
        prefix: 'W-Links',
      },
      {
        path: join(__dirname, 'components/elements/loading'),
        prefix: 'W-Loading',
      },
      {
        path: join(__dirname, 'components/elements/slide-overs'),
        prefix: 'W-Slideovers',
      },
      {
        path: join(__dirname, 'components/elements/steps'),
        prefix: 'W-Steps',
      },
      {
        path: join(__dirname, 'components/elements/tabs'),
        prefix: 'W-Tabs',
      },
      {
        path: join(__dirname, 'components/elements/icons'),
        prefix: 'W-Icons',
      }
    )
  })
}
