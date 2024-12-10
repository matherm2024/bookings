import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-h-[300px] md:max-w-[450px] rounded-lg' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-3/4 text-sm text-gray-600'>
          <p className='text-gray-600 '>The Counsellors offer a safe and <span className='text-gray-900 font-medium'>confidential </span> space where you can talk about anything - no problem is too big or small.

Everything is welcome there is no judgement. If you are nervous to come alone, you are welcome to bring friends with you. <br/><br/>

The Counsellors are all experienced, kind and approachable with the skills to listen deeply and help guide you to navigate difficult emotions and feelings or make challenging decisions. <br/><br/>

We do not tell you what to do but support you to make the choices yourselves. This can be flipping the script on negative dogmatic thinking patterns transforming them into more flexible realistic and self accepting narratives.<br/>
<br/>
Some common themes in Counselling: <br/>

Performance related anxieties <br/>
Shame of being anxious<br/>
Anger management<br/>
Procrastination<br/>
Sexuality<br/>
Self worth<br/>
Friendships/relationships<br/><br/>


We are available on D floor, and you can book your session via the school portal any time of the day or night. We are available 5 days a week. <br/>

If you need support outside of school hours, you may find the following links useful: <br /> <br />
<p className="hover:translate-y-1 transition-all duration-500">
  <a href="https://www.good-thinking.uk/" className="hover:underline">
    Good-Thinking
  </a>
  <br />
</p>

<p className="hover:translate-y-1 transition-all duration-500">
  <a href="https://www.kooth.com/" className="hover:underline">
    Kooth
  </a>
  <br />
</p>

<p className="hover:translate-y-1 transition-all duration-500">
  <a href="https://www.childline.org.uk/" className="hover:underline ">
    Childline
  </a>
  <br />
</p>

<p className="hover:translate-y-1 transition-all duration-500">
  <a href="https://www.youngminds.org.uk/" className="hover:underline">
    Young Minds
  </a>
  <br />
</p>

<p className="hover:translate-y-1 transition-all duration-500">
  <a href="https://www.mind.org.uk/for-young-people/" className="hover:underline">
    Mind
  </a>
  <br />
</p>

</p>
        </div>
      </div>
    </div>
  )
}

export default About

