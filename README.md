# localforage-queue

Based on localForage, some commonly used queue operations are implemented, which can be conveniently used in the browser.

## Usage

### SlidingWindowQueue

Sliding window queue, used to maintain the length of the queue. When the length of the queue exceeds the set value, the data at the head or tail of the queue will be automatically deleted.

```tsx
    const demoQueue = new SlidingWindowQueue(5, 'demo')
    const key = 'demo'
    await demoQueue.getItems(key) // Get queue information
    await demoQueue.pushHead(key, '1')  // Insert from the head, when it exceeds the set value, the data at the tail will be automatically deleted
    await demoQueue.enqueue(key, '1') // Insert from the tail, when it exceeds the set value, the data at the head will be automatically deleted
```
