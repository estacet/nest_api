import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

const port = 3002;

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(port);
    prisma = app.get(PrismaService);

    await prisma.cleanDB();
  });
  afterAll(() => {
    app.close();
  });

  pactum.request.setBaseUrl(`http://localhost:${port}`);

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test1@gmail.com',
      password: '1111',
    };
    describe('Signup', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw an error if no body provided', () => {
        return pactum.spec().post(`/auth/signup`).expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody(dto)
          .expectStatus(201);
        //.inspect(); to see the details
      });
    });
    describe('Login', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw an error if no body provided', () => {
        return pactum.spec().post(`/auth/login`).expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit current user', () => {
        const dto: EditUserDto = {
          lastName: 'Doe',
          firstName: 'John',
        };

        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'Test bookmark',
        link: 'https://docs.nestjs.com/controllers',
        description: 'test description',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        description: 'A brand new description',
      };
      it('edit bookmark by id', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .withBody(dto)
          .expectBodyContains(dto.description)
          .expectStatus(200);
      });
    });
    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(204);
      });
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: `Bearer $S{userToken}`,
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
