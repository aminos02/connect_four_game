import React, { useEffect, useRef, useState } from 'react';
import './App.css'

export default function App() {
  const [phone, setPhone] = useState('')
  return (
    <>
      <input type="tel"
        value={phone}
        onChange={(e) => {
          let val = e.target.value
          val = val.replace(/\D/g, '').slice(0, 10);
          let res = ""
          if (val.length > 0)
            res += '(' + val.slice(0, 3)
          if (val.length > 3)
            res += ") " + val.slice(3, 6)
          if (val.length > 6)
            res += "-" + val.slice(6, 10)
          setPhone(res)
        }
        }
      />
      <button disabled={phone.length != 14}>Submit</button>
    </>
  );
}