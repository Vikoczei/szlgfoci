'use client';

import React, { Suspense } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import Header from '@/components/Header';
import { useTournamentData } from '@/hooks/useTournamentData';
import { getClassColor } from '@/utils/dataUtils';
import { useRouter } from 'next/navigation';

function CsapatokContent() {
  const { teams, standings, topScorers, loading, error } = useTournamentData();
  const router = useRouter();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 1,
            color: 'text.primary',
          }}
        >
          Csapatok
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 4,
          }}
        >
          SZLG LIGA 24/25 bajnokságban
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {teams
            .sort((a, b) => {
              // Ha van standings, akkor aszerint rendezzük, különben abc szerint
              const standingA = standings.find(s => s.team_id === a.id);
              const standingB = standings.find(s => s.team_id === b.id);
              if (standingA && standingB) {
                return (standingA.position || 999) - (standingB.position || 999);
              }
              return a.name.localeCompare(b.name);
            })
            .map(team => {
              const standing = standings.find(s => s.team_id === team.id);
              const scorerCount = topScorers.filter(scorer => scorer.teamId === team.id).length;
              return (
                <Card
                  key={team.id}
                  sx={{
                    height: '100%',
                    border: `2px solid ${getClassColor(team.className)}`,
                    backgroundColor: 'background.paper',
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                      borderColor: getClassColor(team.className),
                    },
                  }}
                  onClick={() => router.push(`/csapatok/${team.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          color: getClassColor(team.className),
                        }}
                      >
                        {team.className}
                      </Typography>
                      {standing && (
                        <Chip
                          label={`${standing.position}.`}
                          size="small"
                          sx={{
                            backgroundColor: getClassColor(team.className),
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Játékosok
                        </Typography>
                        <Typography variant="h6" sx={{ color: getClassColor(team.className), fontWeight: 'bold' }}>
                          {team.players?.length ?? 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Góllövők
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {scorerCount}
                        </Typography>
                      </Box>
                      {standing && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Pontok
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                            {standing.points}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        backgroundColor: getClassColor(team.className),
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: getClassColor(team.className),
                          filter: 'brightness(0.9)',
                        },
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/csapatok/${team.id}`);
                      }}
                    >
                      Részletek megtekintése
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
}

export default function CsapatokPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <CsapatokContent />
    </Suspense>
  );
}
