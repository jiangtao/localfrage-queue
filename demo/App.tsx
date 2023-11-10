import { useState, useEffect } from 'react'
import './App.css'
import { SlidingWindowQueue }  from '../src/index'
let idx = 0


interface IItem {
    key: number,
    name: string,
    component: string
}

function App() {
    const demoQueue = new SlidingWindowQueue(5, 'demo')
    const key = 'demo-1'
    const [list, setList] = useState<IItem[]>([])
    const [remaining, setRemaining] = useState<number>(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        demoQueue.getItems(key).then(items => setList(items))
    })

    // 写一个函数, 生成随机字母, 长度5 以内
    const randomLetter = (n: number): string => {
      return new Array(n).fill(1).reduce((last) => last += String.fromCharCode(parseInt(String(Math.random() * 26)) + 97), '')
    }

    const addItem = async () => {
        idx++;
      // 随机生成一个 item json 添加到队列中
        const item: IItem = { key: idx, name: `${idx}${randomLetter(idx)}`, component: randomLetter(5) }
        console.log(idx, item)
        try {
            demoQueue.pushHead(key, item)
            setList(await demoQueue.getItems(key))
        }catch(e: any) {
            if (demoQueue.isQuotaExceededError(e)) {
                alert('当前浏览器配额不足, 请清楚部分缓存')
            }
        }
    }
    useEffect(() => {
        demoQueue.getRemaining().then((n: number | boolean) => {
            if (typeof n === 'number') {
                const m = Number((n / (1024*1024)).toFixed(2))
                setRemaining(m)
            }
        })
    }, [list])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={async () => await addItem()}>
          count is {list.length} {remaining}
        </button>

      </div>
        <ul>
            {
                list.map(item => {
                    return <>
                        <li key={item.key}>{item.name} {item.component}</li>
                    </>
                })
            }
        </ul>
    </>
  )
}

export default App
