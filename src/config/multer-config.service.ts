import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import sharp from 'sharp'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      // storage: diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     console.log(file)
      //     const extension = path.extname(file.originalname)
      //     cb(null, `${Date.now()+extension}`)
      //   }
      // }),
      storage: memoryStorage(),
      dest: './uploads',
      fileFilter: (req, file, callback) => {
        const isImage = file.mimetype.startsWith('image/')
        const isText = file.mimetype.startsWith('text/')
        if (isImage || isText) return callback(null, true)
        else throw new BadRequestException('Only image and text files are allowed!')
      },
      limits: {
        fileSize: 100 * 1024
      }
    }
  }

  async savingFile(file: Express.Multer.File) {
    const buffer = file.buffer;
    const fileName = `${Date.now() + path.extname(file.originalname)}`
    const filePath = `./uploads/${fileName}`

    if (file.mimetype.startsWith('image/'))
      await sharp(buffer).resize({
        width: 320,
        height: 240,
        fit: 'inside',
      }).toFile(filePath)
    else
      fs.writeFileSync(filePath, buffer)

    return fileName
  }
}