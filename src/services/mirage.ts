import { createServer, Model, Response, hasMany, ActiveModelSerializer, belongsTo } from 'miragejs'
import { BelongsTo, HasMany, ModelInstance } from 'miragejs/-types'
import { SerializerInterface } from 'miragejs/serializer'

type User = ModelInstance & {
  name: string;
  email: string;
  password: string;
  created_at: string;
  videoFeedbacks: HasMany<'videoFeedback'>;
}

type Video = ModelInstance & {
  url: string;
  title: string;
  videoFeedbacks: HasMany<'videoFeedback'>;
}

type Playlist = ModelInstance & {
  name: string;
  videos?: HasMany<'video'>;
  videoIds?: string[];
}

type VideoFeedback = ModelInstance & {
  rate: number;
  comment: string;
  video: BelongsTo<'video'>;
  user: BelongsTo<'user'>;
  userId: number;
  videoId: number;
}

const mockModels = {
  user: Model.extend<Partial<User>>({
    videoFeedbacks: hasMany('videoFeedback')
  }),
  playlist: Model.extend<Partial<Playlist>>({
    videos: hasMany('video')
  }),
  video: Model.extend<Partial<Video>>({
    videoFeedbacks: hasMany('videoFeedback')
  }),
  videoFeedback: Model.extend<Partial<VideoFeedback>>({
    video: belongsTo('video'),
    user: belongsTo('user')
  }),
} 

const mockFactories = {
}

export function makeServer() {
  const server = createServer<typeof mockModels, typeof mockFactories>({
    serializers: {
      application: ActiveModelSerializer,
      playlist: ActiveModelSerializer.extend({
        embed: true,
        include: ['videos'],
      }),
    },
    models: mockModels,
    seeds(server) {
      const user = server.create("user", { 
        name: 'Teste User', 
        email: "teste@email.com", 
        password: "123456", 
        created_at: new Date().toISOString()
      });

      const video1 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 1'
      });
      const video2 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 2'
      });
      const video3 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 3'
      });

      const video4 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 4'
      });
      const video5 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 5'
      });
      const video6 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 6'
      });

      const video7 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 7'
      });
      const video8 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 8'
      });
      const video9 = server.create("video", {
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        title: 'Video 9'
      });

      server.create('playlist', {
        name: "Playlist 01",
        videos: [video1, video2, video3]
      })
      server.create('playlist', {
        name: "Playlist 02",
        videos: [video4, video5, video6]
      })
      server.create('playlist', {
        name: "Playlist 03",
        videos: [video7, video8, video9]
      })

      server.create("videoFeedback", {
        rate: 3,
        comment: 'Test',
        user,
        video: video1
      })
    },
    routes() {
      this.urlPrefix = 'http://localhost:3000'
      this.timing = 750

      this.namespace = '/api'

      this.post('/signin', function(schema, request){
        const body = JSON.parse(request.requestBody)

        const { email, password } = body

        const user = schema.findBy("user", { email, password })

        if(!user){
          return new Response(401, {}, "Invalid credentials.")
        }

        const userSerialized = this.serialize(user).user

        const { password: passwordRemoved, ...userResponse } = userSerialized

        return new Response(200, {}, { user: userResponse, token: "token-test" })
      })

      this.get('/playlists', function(schema){
        const playlists = this.serialize(schema.all('playlist')).playlists || []

        return new Response(200, {}, playlists)
      })

      this.get('/videos/:id/feedback', function(schema, request){
        const headers = request.requestHeaders
        const params = request.params

        if(!headers.user) {
          return new Response(400, {}, "User header not found.")
        }

        const videoFeedback = schema.findBy("videoFeedback", { 
          userId: Number(headers.user), 
          videoId: Number(params.id)  
        })

        if(!videoFeedback){
          return new Response(204)
        }

        return new Response(200, {}, this.serialize(videoFeedback).video_feedback)
      })

      this.put('/videos/:id/feedback', function(schema, request){
        const params = request.params
        const headers = request.requestHeaders
        const body = JSON.parse(request.requestBody)

        if(!headers.user) {
          return new Response(400, {}, "User header not found.")
        }

        const feedbackAlreadyExists = schema.findBy("videoFeedback", { 
          userId: Number(headers.user), 
          videoId: Number(params.id)  
        })

        if(feedbackAlreadyExists){
          feedbackAlreadyExists.update({
            rate: Number(body.rate),
            comment: body.comment,
          })


          return new Response(200, {},  this.serialize(feedbackAlreadyExists).video_feedback)
        }
        else {
          const videoFeedback = schema.create('videoFeedback', {
            userId: Number(headers.user),
            videoId: Number(params.id),
            rate: Number(body.rate),
            comment: body.comment 
          })

          return new Response(200, {}, videoFeedback)
        }
      })

      this.namespace = ''
      this.passthrough()
    }
  })

  return server
}