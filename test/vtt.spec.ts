import { describe, it, expect } from 'vitest';
import { prepareVTTInput, renderVTT, formatTimestamp } from '../src/vtt';
import { mockConfig, mockSheets, mockMetadata } from './fixtures/mocks'



describe('vtt', () => {



    describe('unit', () => {


        describe('renderVTT', () => {
            it('generates correct WEBVTT output', () => {
                const result = renderVTT(
                    90,
                    160,
                    2,
                    2,
                    1,
                    mockSheets
                )

                expect(result.startsWith('WEBVTT')).toBe(true)
                expect(result).toContain('00:00:00.000 --> 00:00:01.000')
                expect(result).toContain('sheet-0.webp#xywh=0,0,160,90')
                expect(result).toContain('sheet-1.webp#xywh=160,90,160,90') // last frame
            })
        })


        describe('formatTimestamp', () => {
            it('formats 0 seconds correctly', () => {
                expect(formatTimestamp(0)).toBe('00:00:00.000')
            })

            it('formats whole seconds', () => {
                expect(formatTimestamp(5)).toBe('00:00:05.000')
                expect(formatTimestamp(65)).toBe('00:01:05.000')
                expect(formatTimestamp(3665)).toBe('01:01:05.000')
            })

            it('formats fractional seconds', () => {
                expect(formatTimestamp(1.5)).toBe('00:00:01.500')
                expect(formatTimestamp(61.123)).toBe('00:01:01.123')
                expect(formatTimestamp(7322.789)).toBe('02:02:02.789')
            })

            it('rounds down milliseconds correctly', () => {
                expect(formatTimestamp(9.999)).toBe('00:00:09.999')
                expect(formatTimestamp(9.0001)).toBe('00:00:09.000')
            })

            it('pads single-digit hours/minutes/seconds', () => {
                expect(formatTimestamp(5)).toBe('00:00:05.000')
                expect(formatTimestamp(65)).toBe('00:01:05.000')
                expect(formatTimestamp(3605)).toBe('01:00:05.000')
            })
        })
    })

})

