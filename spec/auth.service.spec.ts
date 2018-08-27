import {AuthService} from "../src/services/auth.service";

describe('Auth Service', () => {

    const req = {
        user: {
            sub: 'userSub'
        },
        headers: {
            authorization: ''
        }
    };
    let authService: AuthService;
    let next;
    let fetchUserSpy;

    beforeEach(() => {
        authService = new AuthService();
        next = jasmine.createSpy('next');
        fetchUserSpy = spyOn(authService, 'fetchUserId');
    });

    it('should get the current user\'s id and let the request pass', (done) => {
        authService.getCurrentUserId(req, {}, next, {})
            .then(() => {
                expect(next.calls.any()).toBe(true);
                expect(fetchUserSpy.calls.any()).toBe(true);
                done();
            })
            .catch((err: Error) => {
                fail(`Test failed for reason:\n${err.message}`);
                done();
            })
    });

    it('should not let the request pass if there is no user on the request object', (done) => {
        authService.getCurrentUserId({}, {}, next, {})
            .then(() => {
                expect(next.calls.any()).toBe(false);
                expect(fetchUserSpy.calls.any()).toBe(false);
                done();
            })
            .catch((err: Error) => {
                fail(`Test failed for reason:\n${err.message}`);
                done();
            })
    });

    it('should throw an error when token not found', (done) => {
        authService.getUserIdFromToken(null!, {})
            .then(() => {
                fail('Accepted empty token!');
                done();
            })
            .catch((err: Error) => {
                expect(err.message).toBe('Authorization token is needed to access to server!');
                done();
            })
    });

});