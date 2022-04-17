'use strict'

const domcolor = require('../index')
const { readFileSync } = require('fs')

describe('domcolor', () => {
  it('should throw when passed no arguments', async () => {
    try {
      await domcolor()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Error: img is a required parameter')
    }
  })
  it('should throw when passed a path to an invalid image', async () => {
    const imgPath = 'tests/fixtures/fake.mp4'
    try {
      await domcolor(imgPath)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Error: Invalid filename: fake.mp4')
    }
  })
  it('should throw when passed a bad buffer', async () => {
    const fakeBuffer = Buffer.from([1, 2, 3])
    try {
      await domcolor(fakeBuffer)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Error: Invalid image source; unable to decode')
    }
  })
  it('should load an image from file', async () => {
    const imgPath = 'tests/fixtures/rgbb.png'
    expect(async () => {
      await domcolor(imgPath)
    }).not.toThrow()
  })
  it('should load an image from buffer', async () => {
    const imgBuffer = readFileSync('tests/fixtures/rgbb.png')
    expect(async () => {
      await domcolor(imgBuffer)
    }).not.toThrow()
  })
  it('should return the dominant color from a non-transparent image', async () => {
    const imgBuffer = readFileSync('tests/fixtures/rgbb.png')
    const res = await domcolor(imgBuffer)
    expect(res.count).toBe(2)
    expect(res.hex).toBe('0000ff')
    expect(res.rgb).toEqual([0, 0, 255])
    expect(res.total).toBe(4)
  })
  it('should return the dominant color from a transparent image', async () => {
    const imgBuffer = readFileSync('tests/fixtures/g_t.png')
    const res = await domcolor(imgBuffer)
    expect(res.count).toBe(1)
    expect(res.hex).toBe('00ff00')
    expect(res.rgb).toEqual([0, 255, 0])
    expect(res.total).toBe(4)
  })
  it('should return undefined from an image containing only transparent pixels', async () => {
    const imgBuffer = readFileSync('tests/fixtures/t.png')
    const res = await domcolor(imgBuffer)
    expect(res).toBe(undefined)
  })
})
