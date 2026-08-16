/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getPublishedAt() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hour = String(now.getHours()).padStart(2, "0")
  const minute = String(now.getMinutes()).padStart(2, "0")
  const second = String(now.getSeconds()).padStart(2, "0")
  const offsetMinutes = -now.getTimezoneOffset()
  const offsetSign = offsetMinutes >= 0 ? "+" : "-"
  const offsetHour = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0")
  const offsetMinute = String(Math.abs(offsetMinutes) % 60).padStart(2, "0")

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHour}:${offsetMinute}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: ${args[0]}
published: ${getPublishedAt()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
