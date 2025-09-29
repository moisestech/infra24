'use client'

export default function TestPage() {
  console.log('🧪 TEST COMPONENT RENDERED!')
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>TEST COMPONENT WORKS!</h1>
      <p>If you can see this, the component is rendering.</p>
    </div>
  )
}
