<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full md:flex">
      <div class="w-full lg:w-1/3 lg:pr-16">
        <WHeadingsHThree heading="Reporting" />
      </div>
      <div class="w-full lg:w-2/3">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16 my-10 md:my-0"
        >
          <WCardsBase
            heading="Report WELL education events"
            description="Per your WELL Faculty Agreement, you must report all WELL education events where you are the presenter and/or host. Whether it's an "
            thumbnail="well-faculty/dashboard/cards/reporting/events.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://docs.google.com/forms/d/e/1FAIpQLScAdUGARJrotah28aqxN0FDxV_9BRoHM-nvwVE3ynLObZWjVA/viewform?usp=sf_link"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Report Now
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Submit Attendee List (for AIA reporting only)"
            description="If you're presenting to attendees who may be AIA members and eligible for Learning Units (LUs), collect their name, email address and AIA "
            thumbnail="well-faculty/dashboard/cards/reporting/list.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://docs.google.com/forms/d/e/1FAIpQLSelYE0el5e1exboSk3MXzPkXOmizkaqSDVyTMbrhv5Qb-Kgxg/viewform?usp=sf_link"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Submit Now
              </WLinksBase>
            </div>
          </WCardsBase>
        </div>
      </div>
    </div>
  </div>
</template>
