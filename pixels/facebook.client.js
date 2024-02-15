/* eslint-disable no-undef */
import { onLoad } from './helpers/onLoad'

export default ({ app }) => {
  onLoad(() => {
    const script = document.createElement('script')
    script.defer = true

    script.innerHTML = `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');`

    document.head.appendChild(script)

    window.fbq = window.fbq || []

    fbq('init', '1608678962535511')
    fbq('track', 'PageView')
  }, 4500)
}
