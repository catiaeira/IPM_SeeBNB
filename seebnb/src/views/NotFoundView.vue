<template>
  <div id="page">
    <div class="container">
      <span>DATA NOT FOUND</span>
    </div>

    <canvas ref="canvasRef" id="animation"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import frame1 from '@/assets/frame1.txt'
import frame2 from '@/assets/frame2.txt'

const canvasRef = ref(null)

const CHAR_WIDTH = 9      // depends on font
const LINE_HEIGHT = 16

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function loadFile(path) {
  const res = await fetch(path)
  return await res.text()
}

function drawAscii(ctx, text) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.font = '14px monospace'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#3A8F99'

  const lines = text.split('\n')

  lines.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      ctx.fillText(line[col], col * CHAR_WIDTH, row * LINE_HEIGHT)
    }
  })
}

async function loadCanvas() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  const fr1 = await loadFile(frame1)
  const fr2 = await loadFile(frame2)

  // resize canvas based on content
  const rows = fr1.split('\n').length
  const cols = Math.max(...fr1.split('\n').map(l => l.length))

  canvas.width = cols * CHAR_WIDTH
  canvas.height = rows * LINE_HEIGHT

  for (let i = 0; i < 49; i++) {
    drawAscii(ctx, fr1)
    await sleep(500)

    drawAscii(ctx, fr2)
    await sleep(500)
  }
}

onMounted(loadCanvas)
</script>

<style scoped>
#page {
  display: flex;
  flex-direction: column;
}

#animation {
  color: var(--text);
}

.container {
  height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>