<template>
  <div class="p-10">
    <!-- Header Section -->
    <div class="text-center">
      <WHeadingsHOne
        class="text-primary-900"
        heading="MEMBERSHIP COMMUNICATIONS"
      />
      <WHeadingsHTwo class="text-primary-500 my-4" heading="tool kit" />
      <span class="text-md text-primary-900 opacity-50"
        >The membership communications tool kit contains social media, PR and
        marketing resources to help you communicate your membership status to
        your community. The kit includes the official member mark, social media
        copy and graphics, and a template press release. We encourage you to
        access these resources and explore ways to spread the word about your
        membership at IWBI!</span
      >
    </div>
    <!-- Cards Section -->
    <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(card, index) in cards"
        id="card"
        :key="index"
        class="flex flex-col border border-primary-300 rounded-lg relative shadow-md"
      >
        <img
          class="rounded-t-md"
          :src="$config.assetsURL + card.imageUrl"
          alt=""
        />
        <div id="content" class="flex flex-col p-4">
          <span class="uppercase text-sm text-secondary-700">assets</span>
          <span class="text-xl my-1 text-primary-800">{{ card.title }}</span>
          <span class="text-primary-900 opacity-50 text-base mb-12">{{
            card.description
          }}</span>
          <div class="absolute inset-x-0 bottom-0 m-4">
            <a :href="card.link" target="_blank">
              <WButtonsBase type="primaryInverted" icon="download">
                Download
              </WButtonsBase>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Help Section -->
    <WHeadingsHTwo
      class="text-primary-900 my-12 text-center"
      heading="Spread the word about WELL and IWBI membership"
    />
    <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(card, index) in helpCards"
        :key="index"
        class="rounded-md shadow-md border border-primary-300 p-4"
      >
        <WLinksBase
          class="text-lg"
          target="_blank"
          type="navPrimary"
          :link="card.link"
        >
          {{ card.title }}
        </WLinksBase>
        <hr class="my-2" />
        <span class="text-primary-900 opacity-50">{{ card.description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          title: 'WELL Portfolio member mark',
          description:
            "Use the WELL Portfolio member mark in accordance with IWBI's brand guidelines to communication your participation to the world.",
          imageUrl: 'portfolio/screen/membership/member_mark.png',
          link:
            'https://cdn.wellcertified.com/resources/membership/Member+Marks-Portfolio.zip',
        },
        {
          title: 'IWBI brand guidelines',
          description:
            "Consult IWBI's brand guidelines to learn how you can use the official member mark.",
          imageUrl: 'portfolio/screen/membership/brand_guidelines.png',
          link:
            'https://resources.wellcertified.com/tools/well-branding-guidelines/',
        },
        {
          title: 'Press release template',
          description:
            'Customize the included membership press release template to announce your membership.',
          imageUrl: 'portfolio/screen/membership/release_template.png',
          link:
            'https://cdn.wellcertified.com/resources/membership/Template+Press+Release+for+WELL+Members.docx',
        },
        {
          title: 'IWBI member public relations guidelines',
          description:
            'Browse our PR guidelines for information on how to refer to yourself as an official IWBI member.',
          imageUrl: 'portfolio/screen/membership/pr_guidelines.png',
          link:
            'https://cdn.wellcertified.com/resources/membership/PR+Guidelines.pdf',
        },
        {
          title: 'Social media posts',
          description:
            'Post these pre-written statements to your social media accounts, or draft your own.',
          imageUrl: 'portfolio/screen/membership/media_posts.png',
          link:
            'https://resources.wellcertified.com/tools/membership-social-promotion-kit/',
        },
        {
          title: 'Social media promotional assets',
          description:
            'Leverage the included graphics for an extra pop on your social posts about IWBI membership.',
          imageUrl: 'portfolio/screen/membership/promotional_assets.png',
          link:
            'https://cdn.wellcertified.com/resources/membership/Member+Promokit.zip',
        },
      ],
      helpCards: [
        {
          title: 'What is WELL?',
          link:
            'https://resources.wellcertified.com/tools/telling-the-well-story-or-what-is-well-/',
          description:
            'Learn about what makes WELL the premier standard for buildings and communities around the globe.',
        },
        {
          title: 'Global Adoption of WELL',
          link:
            'https://a.storyblok.com/f/52232/x/cab583e68c/well-global-adoption.pdf',
          description:
            'Access now to explore how WELL is accelerating market transformation around in over 58 countries around the world.',
        },
        {
          title: 'Why WELL?',
          link:
            'https://resources.wellcertified.com/tools/telling-the-well-story-or-why-well-/',
          description:
            'Learn why and how WELL Certification can result in meaningful return on investment.',
        },
        {
          title: 'How to share membership access with other employees',
          link:
            'https://cdn.wellcertified.com/resources/membership/Membership_How+to+share+access+with+other+employees.pdf',
          description:
            'Download for tips on encouraging others to access and experience the benefits of IWBI membership.',
        },
      ],
    }
  },
}
</script>

<style></style>
