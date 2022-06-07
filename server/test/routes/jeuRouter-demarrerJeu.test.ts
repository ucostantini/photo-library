import supertest from 'supertest'
import 'jest-extended';
import app from '../../src/app';

const request = supertest(app);

const testNom1 = 'Jean-Marc';
const testNom2 = 'Pierre';

describe('GET /api/v1/jeu/demarrerJeu/:id', () => {

    it(`devrait répondre avec succès au premier appel pour joueur ${testNom1}`, async () => {
        const response = await request.post('/api/v1/jeu/demarrerJeu').send({nom: testNom1});
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.joueur.nom).toBe(testNom1);
        expect(response.body.joueur.lancers).toBe(0);
        expect(response.body.joueur.lancersGagnes).toBe(0);
    });

    it(`devrait répondre avec succès au premier appel pour joueur ${testNom2}`, async () => {
        const response = await request.post('/api/v1/jeu/demarrerJeu').send({nom: testNom2});
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        expect(response.body.joueur.nom).toBe(testNom2);
        expect(response.body.joueur.lancers).toBe(0);
        expect(response.body.joueur.lancersGagnes).toBe(0);
    });

    it(`devrait répondre avec une mauvaise demande pour un appel en double pour le joueur ${testNom1}`, async () => {
        const response = await request.post('/api/v1/jeu/demarrerJeu').send({nom: testNom1});
        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");
        expect(response.body.error).toInclude('existe déjà');
    });

    it('devrait répondre avec une mauvaise demande pour le paramètre de nom manquant', async () => {
        const response = await request.post('/api/v1/jeu/demarrerJeu').send({});
        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");
        expect(response.body.error).toInclude('Le paramètre nom est absent');
    });

    it('devrait répondre avec une mauvaise demande pour le paramètre de nom vide', async () => {
        const response = await request.post('/api/v1/jeu/demarrerJeu').send({nom: "   \t"});
        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");
        expect(response.body.error).toInclude('Le nom ne peut pas être vide');
    });

});
