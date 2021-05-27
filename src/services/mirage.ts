import { createServer, Model, Response, hasMany, belongsTo, ActiveModelSerializer, Serializer } from 'miragejs'
import { BelongsTo, HasMany, ModelInstance } from 'miragejs/-types'
import { SerializerInterface } from 'miragejs/serializer'

type User = ModelInstance & {
  name: string;
  email: string;
  password: string;
  created_at: string;
}

type Video = ModelInstance & {
  url: string;
  title: string;
  playlist: BelongsTo<'playlist'>;
}

type Playlist = ModelInstance & {
  name: string;
  videos?: HasMany<'videos'>
}

type VideoFeedback = ModelInstance & {
  rate: number;
  comment: string;
}

const mockModels = {
  user: Model.extend<Partial<User>>({}),
  playlist: Model.extend<Partial<Playlist>>({
    videos: hasMany()
  }),
  video: Model.extend<Partial<Video>>({
    playlist: belongsTo()
  }),
  videoFeedback: Model.extend<Partial<VideoFeedback>>({}),
} 

const mockFactories = {
}

const ApplicationSerializer: SerializerInterface = ActiveModelSerializer.extend({
  root: false,
  embed: false
})

export function makeServer() {
  const server = createServer<typeof mockModels, typeof mockFactories>({
    serializers: {
      application: ApplicationSerializer,
      playlist: ApplicationSerializer.extend({
        embed: true,
        include: ['videos'],
      }),
      video: ApplicationSerializer.extend({
        embed: false,
      })
    },
    models: mockModels,
    seeds(server) {
      server.create("user", { 
        name: 'Teste User', 
        email: "teste@email.com", 
        password: "123456", 
        created_at: new Date().toISOString()
      });

      const video1 = server.create("video", {
        url: "https://www.youtube.com/watch?v=HmZKgaHa3Fg",
        title: 'Video 1'
      });
      const video2 = server.create("video", {
        url: "https://www.youtube.com/watch?v=DQuhA5ZCV9M",
        title: 'Video 2'
      });
      const video3 = server.create("video", {
        url: "https://www.youtube.com/watch?v=KiV03Sjj0Ng",
        title: 'Video 3'
      });

      const video4 = server.create("video", {
        url: "https://www.youtube.com/watch?v=672TY8K2PKk",
        title: 'Video 4'
      });
      const video5 = server.create("video", {
        url: "https://www.youtube.com/watch?v=lRTtMcx6rSM",
        title: 'Video 5'
      });
      const video6 = server.create("video", {
        url: "https://www.youtube.com/watch?v=s9X0_Vb-4zc",
        title: 'Video 6'
      });

      const video7 = server.create("video", {
        url: "https://www.youtube.com/watch?v=672TY8K2PKk",
        title: 'Video 7'
      });
      const video8 = server.create("video", {
        url: "https://www.youtube.com/watch?v=lRTtMcx6rSM",
        title: 'Video 8'
      });
      const video9 = server.create("video", {
        url: "https://www.youtube.com/watch?v=s9X0_Vb-4zc",
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
    },
    routes() {
      this.urlPrefix = 'http://localhost:3000'
      this.timing = 750

      this.namespace = '/api'

      this.post('/signin',(schema, request) => {
        try {
          const body = JSON.parse(request.requestBody)

          const { email, password } = body
  
          const user = schema.findBy("user", { email, password })
  
          if(!user){
            return new Response(401, {}, "Invalid credentials.")
          }
  
          const { password: passwordRemoved, ...userResponse } = user
  
          return new Response(200, {}, { user: userResponse, token: "token-test" })
        }
        catch(err){
          console.log(err)
          return new Response(500, {}, '(Mirage) Internal Server Error')
        }
      })

      this.get('/playlists', function(schema){
        try {
          const playlists = this.serialize(schema.all('playlist')).playlists

          return new Response(200, {}, playlists)
        }
        catch(err){
          console.log(err)
          return new Response(500, {}, '(Mirage) Internal Server Error')
        }
      })
    }
  })

  return server
}