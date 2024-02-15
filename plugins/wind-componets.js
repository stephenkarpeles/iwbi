export default ({ app }, inject) => {
  inject('wind', {
    analytics: true,
    icons: {
      base: {
        neutral: 'focus:outline-none',
        blank: 'focus:outline-none mx-1 w-5 h-5 my-auto',
        primary: 'focus:outline-none text-primary-600 mx-1 w-5 h-5 my-auto',
        danger:
          'focus:outline-none text-secondary-800 hover:text-secondary-900 transition duration-150 mx-1 w-5 h-5 my-auto',
        secondary: 'focus:outline-none text-secondary-600 mx-1 w-5 h-5 my-auto',
      },
    },
    links: {
      base: {
        secondary:
          'flex active:text-secondary-700 font-medium text-secondary-600 hover:text-secondary-800 transition duration-150 ease-in-out h-full',
        navPrimary: 'flex text-primary-700 select-none focus:outline-none',
        navPrimary2: 'flex text-primary-300 select-none focus:outline-none',
        warning:
          'flex active:text-yellow-700 font-medium text-yellow-600 hover:text-yellow-800 transition duration-150 ease-in-out h-full',
        primary:
          'flex active:text-primary-700 font-medium text-primary-600 hover:text-primary-800 transition duration-150 ease-in-out h-full',
        danger:
          'flex active:text-danger-500 font-medium text-danger-500 hover:text-danger-600 transition duration-150 ease-in-out h-full',
      },
    },
    buttons: {
      base: {
        blank: 'focus:outline-none',
        tooltip: 'text-primary-600 hover:text-primary-800 focus:outline-none',
        pill: 'flex text-sm px-5 py-1 rounded-full border focus:outline-none',
        pillOption:
          'border rounded-lg py-2 px-4 text-center text-sm cursor-pointer hover:bg-primary-700 hover:text-white focus:outline-none',
        tab: 'flex items-center mr-4 py-5 px-1 text-center border-b-2 font-medium text-sm leading-5 focus:outline-none text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300',
        tabSelected:
          'flex mr-4 py-5 px-1 text-center border-b-2 font-medium text-sm leading-5 focus:outline-none text-primary-600 border-primary-400',
        listingPrimaryInverted:
          'w-full my-auto flex justify-center py-2 px-2 text-sm font-medium transition duration-150 ease-in-out w-full inline-flex justify-center py-2 px-4 hover:border-t hover:border-b border-primary-300 bg-white text-sm font-medium text-primary-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out hover:bg-primary-200 hover:text-primary-900',
        neutral:
          'focus:outline-none duration-150 ease-in-out transition w-full my-auto flex justify-center py-2 px-2 text-sm font-medium transition duration-150 ease-in-out',
        navPrimary: 'flex text-primary-700 select-none focus:outline-none',
        subNav:
          'transition-colors duration-300 ease-in-out flex focus:bg-primary-700 focus:outline-none font-medium hover:bg-primary-800 hover:text-white items-center leading-5 mt-2 px-2 py-2 rounded-md text-sm transition w-full',
        nav: 'w-full flex items-center px-2 py-2 text-sm leading-5 font-medium text-white focus:outline-none transition ease-in-out duration-150',
        primary:
          'border-transparent bg-primary-600 shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out hover:bg-primary-500 hover:border-primary-700 active:bg-primary-700 text-white transition duration-150 ease-in-out',
        light:
          'focus:outline-none border-transparent bg-white shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out hover:bg-white hover:border-primary-700 text-primary-600 transition duration-150 ease-in-out',
        primaryInverted:
          'shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out w-full inline-flex justify-center py-2 px-4 border border-primary-300 rounded-md bg-white text-sm font-medium text-primary-500 hover:text-primary-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out',
        alert:
          'shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out w-full inline-flex justify-center py-2 px-4 border border-yellow-300 rounded-md bg-white text-sm font-medium text-yellow-500 hover:text-yellow-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out',
        danger:
          'border-transparent bg-danger-500 shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out hover:bg-danger-600 hover:border-danger-700 active:bg-danger-700 text-white',
        dangerInverted:
          'shadow-md w-full my-auto flex justify-center py-2 px-2 border text-sm font-medium rounded-md transition duration-150 ease-in-out w-full inline-flex justify-center py-2 px-4 border border-danger-300 rounded-md bg-white text-sm font-medium text-danger-500 hover:text-danger-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out',
      },
    },
  })
}
