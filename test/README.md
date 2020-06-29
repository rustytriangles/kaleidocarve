# makeplan test

For this input:

![screenshot](../images/makeplan_test.png)

Raw output should be:

0 - [Pa, Pb, Pg, Ph]
1 - [Pb, Pc, Pd, P2, Pe, Pf, P4, Pg, Ph]
2 - [Pc, P1, Pd] [Pe, P3, Pf]

Stitched output should be:

[retracted(Pa), Pa, Pb, Pg, Ph, retracted(Ph),
 retracted(Pb), Pb, Pc, Pd, P2, Pe, Pf, P4, Pg, Ph, retracted(Ph),
 retracted(Pc), P1, Pd, retracted(Pd), retracted(Pe), Pe, P3, Pf, retracted(Pf)]


For the second input:

![screenshot](../images/makeplan_test2.png)

[retracted(P6), P6, P7, Pi, Pj, P10, retracted(P10)]
[retracted(Pi), Pi, P8, P9, Pj, retracted(Pj)]

