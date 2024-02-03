import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {Announcement, parseAnnouncementId} from './announcement.server';

describe('domain/announcement', () => {
  describe('parsing', () => {
    const uuid = faker.string.uuid();
    const validAnnouncementObject = {
      id: uuid,
      title: 'Title',
      content: 'Content',
      status: 'DRAFT' as const,
      createdByUser: {
        id: uuid,
        name: 'Jim',
      },
      publishedByUser: {
        id: uuid,
        name: 'Jim',
      },
      org_id: uuid,
      publishedAt: null,
      createdAt: '2012-06-01T12:34:00Z' as const,
      updatedAt: '2012-06-01T12:34:00Z' as const,
    };

    describe('parse-announcement', () => {
      it('parses a normal announcement record', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown(validAnnouncementObject)
        );

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value).toStrictEqual({
              id: uuid,
              org_id: uuid,
              title: 'Title',
              content: 'Content',
              status: 'DRAFT' as const,
              createdByUser: {
                id: uuid,
                name: 'Jim',
              },
              publishedByUser: {
                id: uuid,
                name: 'Jim',
              },
              publishedAt: null,
              createdAt: new Date('2012-06-01T12:34:00Z'),
              updatedAt: new Date('2012-06-01T12:34:00Z'),
            });
          },
        });
      });

      it('fails parsing with short `title`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({...validAnnouncementObject, title: 'A'})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with huge `title`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({
            ...validAnnouncementObject,
            name: 'AB'.repeat(51),
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `uuid`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({...validAnnouncementObject, id: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `title`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({
            ...validAnnouncementObject,
            title: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `status`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({
            ...validAnnouncementObject,
            status: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({
            ...validAnnouncementObject,
            createdAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          Announcement.fromUnknown({
            ...validAnnouncementObject,
            updatedAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });
    });

    describe('parse-id', () => {
      it('parses a valid uuid as announcement-id', () => {
        const result = Effect.runSyncExit(
          parseAnnouncementId(validAnnouncementObject.id)
        );
        expect(result._tag).toBe('Success');
      });

      it('fails parsing gibberish as announcement-id', () => {
        const result = Effect.runSyncExit(parseAnnouncementId('gibberish'));
        expect(result._tag).toBe('Failure');
      });
    });
  });

  describe('record-to-domain', () => {
    const uuid = faker.string.uuid();
    const validRecord = {
      id: uuid,
      title: 'Title',
      content: 'Content',
      status: 'DRAFT' as const,
      published_at: null,
      created_at: '2012-06-01T12:34:00Z' as const,
      updated_at: '2012-06-01T12:34:00Z' as const,
      published_by_user_id: uuid,
      created_by_user_id: uuid,
      org_id: uuid,
    };

    const createdByUser = {
      id: uuid,
      name: 'Jim',
    };
    const publishedByUser = {
      id: uuid,
      name: 'Jim',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(
        Announcement.fromRecord({
          record: validRecord,
          createdByUser,
          publishedByUser,
        })
      );

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            id: uuid,
            org_id: uuid,
            title: 'Title',
            content: 'Content',
            status: 'DRAFT' as const,
            createdByUser: {
              id: uuid,
              name: 'Jim',
            },
            publishedByUser: {
              id: uuid,
              name: 'Jim',
            },
            publishedAt: null,
            createdAt: new Date('2012-06-01T12:34:00Z'),
            updatedAt: new Date('2012-06-01T12:34:00Z'),
          });
        },
      });
    });

    it('fails parsing when missing `uuid`', () => {
      const result = Effect.runSyncExit(
        Announcement.fromRecord({
          // @ts-expect-error
          record: {...validRecord, id: undefined},
          createdByUser,
          publishedByUser,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `title`', () => {
      const result = Effect.runSyncExit(
        Announcement.fromRecord({
          // @ts-expect-error
          record: {...validRecord, title: undefined},
          createdByUser,
          publishedByUser,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `content`', () => {
      const result = Effect.runSyncExit(
        Announcement.fromRecord({
          // @ts-expect-error
          record: {...validRecord, content: undefined},
          createdByUser,
          publishedByUser,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `status`', () => {
      const result = Effect.runSyncExit(
        Announcement.fromRecord({
          // @ts-expect-error
          record: {...validRecord, status: undefined},
          createdByUser,
          publishedByUser,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `createdAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Announcement.fromRecord({...validRecord, created_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `updatedAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Announcement.fromRecord({...validRecord, updated_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
