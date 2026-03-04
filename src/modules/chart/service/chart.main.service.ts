import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChartDto } from '../dto/create-chart.dto';
import { UpdateChartDto } from '../dto/update-chart.dto';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';
import { UpdateMultipleChartsDto, UpdateSingleChartDto } from '../dto/update.data.dto';
import { CloneSingleChartDto } from '../dto/clone.dto';
import { ApplyTemplateDto } from '../dto/apply-template.dto';
import { CreateChartBuildDto } from '../dto/create-chart-build.dto';
import { mergeAndSum } from '../utils/merge-and-sum';

@Injectable()
export class ChartMainService {
  constructor(private readonly prisma: PrismaService) { }

  //create chart
  async create(createChartDto: CreateChartDto) {
    let subChat = {};
    const { xAxis, yAxis, zAxis, title, status, category, parentId, rootchart, projectId, roottitle, grouptitle } = createChartDto;

    // if (!createChartDto.projectId)
    //   throw new NotFoundException('projectId is required');



    const result = await this.prisma.$transaction(async (txPrisma) => {


      if (parentId) {
        const parentExists = await txPrisma.chartTable.findUnique({
          where: { id: parentId },
          select: { id: true },
        });

        if (!parentExists) {
          throw new NotFoundException('Parent chart does not exist');
        }
      }

      function generateShortId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      const mainChart = await txPrisma.chartTable.create({
        data: {
          id: generateShortId(),
          title,
          grouptitle,
          parentId: parentId ?? null,
          status,
          category,
          xAxis: JSON.parse(xAxis),
          yAxis: yAxis ? JSON.parse(yAxis) : Prisma.JsonNull,
          zAxis: zAxis ? JSON.parse(zAxis) : Prisma.JsonNull,

          // SABBIR - Relation to program //
          projectId: createChartDto.projectId,
          // SABBIR //
        },
      });


      if (rootchart && roottitle) {
        const project = await txPrisma.project.findUnique({
          where: { id: projectId! },
          select: { id: true },
        });

        if (!project) {
          throw new NotFoundException('Project not found');
        }
        await txPrisma.rootChart.create({

          data: {
            value: mainChart.id,
            title: roottitle ?? null,
            projectId
          },
        });
      }


      switch (category) {
        case ChartName.BAR: {
          const {
            numberOfDataset,
            firstFiledDataset,
            lastFieldDataset: lastFiledDAtaset,
            widgets,
          } = createChartDto;

          subChat = await txPrisma.barChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFiledDataset!,
              lastFiledDAtaset: lastFiledDAtaset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HORIZONTAL_BAR: {
          const {
            numberOfDataset,
            firstFieldDataset,
            lastFieldDataset,
            widgets,
          } = createChartDto;

          subChat = await txPrisma.horizontalBarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PIE: {
          const { numberOfDataset, widgets, firstFieldDataset,
            lastFieldDataset, } = createChartDto;
          subChat = await txPrisma.pi.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.HEATMAP: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.heatMapChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    // color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.AREA: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.areaChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.LINE: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.multiAxisChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.COLUMN: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.columnChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HISTOGRAM: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.histogramChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PARETO: {
          const { numberOfDataset, widgets, Left_firstFieldDataset, Left_lastFieldDataset, Right_firstFieldDataset, Right_lastFieldDataset } = createChartDto;

          subChat = await txPrisma.paretoChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              Left_firstFieldDataset: Left_firstFieldDataset!,
              Left_lastFieldDataset: Left_lastFieldDataset!,
              Right_firstFieldDataset: Right_firstFieldDataset!,
              Right_lastFieldDataset: Right_lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.FUNNEL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.funnelChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.WATERFALL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.waterFallChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.RADAR: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.radarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.DOUGHNUT: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.doughnutChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.CANDLESTICK: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.candlestickChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.STACK_BAR_HORIZONTAL: {
          const { numberOfDataset, widgets, firstFiledDataset, lastFieldDataset: lastFiledDAtaset, } = createChartDto;

          subChat = await txPrisma.stackedBarChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFiledDataset!,
              lastFiledDAtaset: lastFiledDAtaset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.GAUGE: {
          const { widgets, startingRange, endRange, gaugeValue, chartHight, startAngle, endAngle, trackColor, strokeWidth, valueFontSize, shadeIntensity } = createChartDto;

          subChat = await txPrisma.solidGaugeChart.create({
            data: {
              chartTableId: mainChart.id,
              startingRange: startingRange!,
              endRange: endRange!,
              gaugeValue: gaugeValue!,
              chartHight: chartHight!,
              startAngle: startAngle!,
              endAngle: endAngle!,
              trackColor: trackColor!,
              strokeWidth: strokeWidth!,
              valueFontSize: valueFontSize!,
              shadeIntensity: shadeIntensity!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.SCATTER: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.scatterChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        // scatterChart

        default: {
          throw new BadRequestException(
            `Chart type "${status}" is not supported`,
          );
        }
      }
      return { ...mainChart };
    });
    return result;
  }


  async createatfirstime(createChartDto: CreateChartDto) {
    let subChat = {};
    const { xAxis, yAxis, zAxis, title, status, category, parentId, rootchart, projectId, roottitle, grouptitle } = createChartDto;

    if (!createChartDto.projectId)
      throw new NotFoundException('projectId is required');

    const result = await this.prisma.$transaction(async (txPrisma) => {




      if (parentId) {
        const parentExists = await txPrisma.chartTable.findUnique({
          where: { id: parentId },
          select: { id: true },
        });

        if (!parentExists) {
          throw new NotFoundException('Parent chart does not exist');
        }
      }

      function generateShortId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      const mainChart = await txPrisma.chartTable.create({
        data: {
          id: generateShortId(),
          title,
          grouptitle,
          parentId: parentId ?? null,
          status,
          category,
          xAxis: JSON.parse(xAxis),
          yAxis: yAxis ? JSON.parse(yAxis) : Prisma.JsonNull,
          zAxis: zAxis ? JSON.parse(zAxis) : Prisma.JsonNull,

          // SABBIR - Relation to program //
          projectId: createChartDto.projectId,
          // SABBIR //
        },
      });


      if (rootchart && roottitle) {
        const project = await txPrisma.project.findUnique({
          where: { id: projectId! },
          select: { id: true },
        });

        if (!project) {
          throw new NotFoundException('Project not found');
        }
        await txPrisma.rootChart.create({

          data: {
            value: mainChart.id,
            title: roottitle ?? null,
            projectId
          },
        });

      }


      switch (category) {
        case ChartName.BAR: {
          const { numberOfDataset, firstFieldDataset, lastFieldDataset, widgets, } = createChartDto;
          subChat = await txPrisma.barChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFieldDataset!,
              lastFiledDAtaset: lastFieldDataset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HORIZONTAL_BAR: {
          const { numberOfDataset, firstFieldDataset, lastFieldDataset, widgets, } = createChartDto;

          console.log("Horizontal Bar Chart Data:", { numberOfDataset, firstFieldDataset, lastFieldDataset, widgets });

          subChat = await txPrisma.horizontalBarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PIE: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;
          subChat = await txPrisma.pi.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.HEATMAP: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.heatMapChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    // color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.AREA: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.areaChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.LINE: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;



          subChat = await txPrisma.multiAxisChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.COLUMN: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.columnChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HISTOGRAM: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.histogramChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PARETO: {
          const { numberOfDataset, widgets, Left_firstFieldDataset, Left_lastFieldDataset, Right_firstFieldDataset, Right_lastFieldDataset } = createChartDto;

          subChat = await txPrisma.paretoChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              Left_firstFieldDataset: Left_firstFieldDataset!,
              Left_lastFieldDataset: Left_lastFieldDataset!,
              Right_firstFieldDataset: Right_firstFieldDataset!,
              Right_lastFieldDataset: Right_lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.FUNNEL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.funnelChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.WATERFALL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.waterFallChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.RADAR: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.radarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.DOUGHNUT: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.doughnutChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.CANDLESTICK: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.candlestickChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.STACK_BAR_HORIZONTAL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.stackedBarChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFieldDataset!,
              lastFiledDAtaset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.GAUGE: {
          const { widgets, startingRange, endRange, gaugeValue, chartHight, startAngle, endAngle, trackColor, strokeWidth, valueFontSize, shadeIntensity } = createChartDto;

          subChat = await txPrisma.solidGaugeChart.create({
            data: {
              chartTableId: mainChart.id,
              startingRange: startingRange!,
              endRange: endRange!,
              gaugeValue: gaugeValue!,
              chartHight: chartHight!,
              startAngle: startAngle!,
              endAngle: endAngle!,
              trackColor: trackColor!,
              strokeWidth: strokeWidth!,
              valueFontSize: valueFontSize!,
              shadeIntensity: shadeIntensity!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.SCATTER: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.scatterChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.SPLINE: {
          const { numberOfDataset, firstFieldDataset, lastFieldDataset, widgets, } = createChartDto;
          subChat = await txPrisma.splineChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFieldDataset!,
              lastFiledDAtaset: lastFieldDataset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        // scatterChart

        default: {
          throw new BadRequestException(
            `Chart type "${status}" is not supported`,
          );
        }
      }
      return { ...mainChart };
    });
    return result;
  }

  //find all active charts
  async findAllActive() {
    const activeCharts = await this.prisma.chartTable.findMany({
      where: { status: ChartStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeCharts || activeCharts.length === 0) {
      throw new NotFoundException('No active charts found');
    }

    return activeCharts;
  }

  //find all inactive charts
  async findAllInactive() {
    const inactiveCharts = await this.prisma.chartTable.findMany({
      where: { status: ChartStatus.INACTIVE },
      orderBy: { createdAt: 'desc' },
    });

    if (!inactiveCharts || inactiveCharts.length === 0) {
      throw new NotFoundException('No inactive charts found');
    }

    return inactiveCharts;
  }

  // async findOne(id: string) {
  //   const chart = await this.prisma.chartTable.findUnique({
  //     where: { id },
  //     include: {
  //       heatmap: { include: { widgets: true } },
  //       pi: { include: { widgets: true } },
  //       sheet: true,
  //     },
  //   });

  //   if (!chart) return null;

  //   const { heatmap, pi, sheet, ...main } = chart;

  //   return {
  //     ...main,
  //     ...(heatmap ?? {}),
  //     ...(pi ?? {}),
  //     ...(sheet ?? {}),
  //   };
  // }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Chart ID is required');
    }

    const chart = await this.prisma.chartTable.findUnique({
      where: { id },
      include: {
        barChart: { include: { widgets: true } },
        horizontalBarChart: { include: { widgets: true } },
        pi: { include: { widgets: true } },
        heatmap: { include: { widgets: true } },
        areaChart: { include: { widgets: true } },
        multiAxisChart: { include: { widgets: true } },
        columnChart: { include: { widgets: true } },
        stackedBarChart: { include: { widgets: true } },
        doughnutChart: { include: { widgets: true } },
        paretoChart: { include: { widgets: true } },
        histogramChart: { include: { widgets: true } },
        scatterChart: { include: { widgets: true } },
        solidGaugeChart: { include: { widgets: true } },
        funnelChart: { include: { widgets: true } },
        waterFallChart: { include: { widgets: true } },
        candlestickChart: { include: { widgets: true } },
        radarChart: { include: { widgets: true } },
        sheet: true,
      },
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    const {
      barChart,
      horizontalBarChart,
      pi,
      heatmap,
      areaChart,
      multiAxisChart,
      columnChart,
      stackedBarChart,
      doughnutChart,
      paretoChart,
      histogramChart,
      scatterChart,
      solidGaugeChart,
      funnelChart,
      waterFallChart,
      candlestickChart,
      radarChart,
      sheet,
      ...main
    } = chart;

    return {
      ...main,
      ...(barChart ?? {}),
      ...(horizontalBarChart ?? {}),
      ...(pi ?? {}),
      ...(heatmap ?? {}),
      ...(areaChart ?? {}),
      ...(multiAxisChart ?? {}),
      ...(columnChart ?? {}),
      ...(stackedBarChart ?? {}),
      ...(doughnutChart ?? {}),
      ...(paretoChart ?? {}),
      ...(histogramChart ?? {}),
      ...(scatterChart ?? {}),
      ...(solidGaugeChart ?? {}),
      ...(funnelChart ?? {}),
      ...(waterFallChart ?? {}),
      ...(candlestickChart ?? {}),
      ...(radarChart ?? {}),
      ...(sheet ?? {}),
    };
  }


  async getSpecificChart(type: ChartName, id: string) {
    let result;
    switch (type) {
      case ChartName.BAR:
        result = await this.prisma.barChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.HORIZONTAL_BAR:
        result = await this.prisma.horizontalBarChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.PIE:
        result = await this.prisma.pi.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.HEATMAP:
        result = await this.prisma.heatMapChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.AREA:
        result = await this.prisma.areaChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.LINE:
        result = await this.prisma.multiAxisChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.COLUMN:
        result = await this.prisma.columnChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.HISTOGRAM:
        result = await this.prisma.histogramChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.PARETO:
        result = await this.prisma.paretoChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.FUNNEL:
        result = await this.prisma.funnelChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.WATERFALL:
        result = await this.prisma.waterFallChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.RADAR:
        result = await this.prisma.radarChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.DOUGHNUT:
        result = await this.prisma.doughnutChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.CANDLESTICK:
        result = await this.prisma.candlestickChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.STACK_BAR_HORIZONTAL:
        result = await this.prisma.stackedBarChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.GAUGE:
        result = await this.prisma.solidGaugeChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      case ChartName.SCATTER:
        result = await this.prisma.scatterChart.findUnique({
          where: { id },
          include: { widgets: true },
        });
        break;
      default:
        throw new BadRequestException(`Chart type "${type}" is not supported`);
    }

    if (!result) {
      throw new NotFoundException(`Chart with ID ${id} and type ${type} not found`);
    }

    return result;
  }


  //update chart
  update(id: string, updateChartDto: UpdateChartDto) {
    const { xAxis, yAxis, zAxis, ...rest } = updateChartDto;

    const data: Prisma.ChartTableUpdateInput = { ...rest };

    if (xAxis) {
      data.xAxis = JSON.parse(xAxis);
    }
    if (yAxis) {
      data.yAxis = JSON.parse(yAxis);
    }

    if (updateChartDto.hasOwnProperty('zAxis')) {
      data.zAxis = zAxis ? JSON.parse(zAxis) : Prisma.JsonNull;
    }

    return this.prisma.chartTable.update({
      where: { id },
      data,
    });
  }

  //delete chart
  remove(id: string) {
    return this.prisma.chartTable.delete({ where: { id } });
  }



  async findsomelavelenode(parentId: string) {
    if (!parentId) {
      throw new BadRequestException('Parent ID is required');
    }

    const sameLevelNodes = await this.prisma.chartTable.findMany({
      where: {
        parentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        barChart: {
          include: { widgets: true },
        },
        horizontalBarChart: {
          include: { widgets: true },
        },
        pi: {
          include: { widgets: true },
        },
        heatmap: {
          include: { widgets: true },
        },
        areaChart: {
          include: { widgets: true },
        },
        multiAxisChart: {
          include: { widgets: true },
        },
        columnChart: {
          include: { widgets: true },
        },
        stackedBarChart: {
          include: { widgets: true },
        },
        doughnutChart: {
          include: { widgets: true },
        },
        paretoChart: {
          include: { widgets: true },
        },
        histogramChart: {
          include: { widgets: true },
        },
        scatterChart: {
          include: { widgets: true },
        },
        solidGaugeChart: {
          include: { widgets: true },
        },
        funnelChart: {
          include: { widgets: true },
        },
        waterFallChart: {
          include: { widgets: true },
        },
        candlestickChart: {
          include: { widgets: true },
        },
        radarChart: {
          include: { widgets: true },
        },
        splineChart: {
          include: { widgets: true },
        },
      },
    });

    if (!sameLevelNodes.length) {
      throw new NotFoundException('No chart is found');
    }

    return sameLevelNodes;
  }




  async valuechageCalculations(id: string, updatedata: UpdateSingleChartDto) {

    let flag = false;

    const changePossible = await this.prisma.chartTable.findMany({
      where: { parentId: id }
    })

    if (changePossible.length > 0) {
      throw new Error("This is not a child subtier; it already has child records.")
    }


    const history = await this.prisma.chartTable.findUnique({
      where: { id }
    })

    if (history?.xAxis) {
      await this.prisma.chartHistory.create({
        data: {
          value: history?.xAxis,
          chartId: id,
          createdAt: updatedata.datasettime || new Date()
        }
      })
    }

    const updateResult = await this.prisma.chartTable.update({
      where: { id },
      data: {
        xAxis: JSON.parse(updatedata.xAxis)
      }
    })

    if (!updateResult?.parentId) {
      return updateResult
    }

    let nodeId = updateResult?.parentId

    while (!flag) {

      const reuslt = await this.prisma.chartTable.findMany({
        where: { parentId: nodeId }
      })

      const tables = reuslt
        .map(item => item.xAxis)
        .filter(Boolean)

      if (!tables.length) {
        console.log("No tables found")
        break
      }
      const data = await mergeAndSum(tables)

      const history = await this.prisma.chartTable.findUnique({
        where: { id: nodeId as string }
      })

      if (history?.xAxis) {
        await this.prisma.chartHistory.create({
          data: {
            value: history?.xAxis,
            chartId: nodeId,
          }
        })
      }

      await this.prisma.chartTable.update({
        where: { id: nodeId as string },
        data: {
          xAxis: data
        }
      })

      const findingParent = await this.prisma.chartTable.findUnique({
        where: { id: reuslt[0].parentId ?? undefined }
      });

      if (!findingParent?.parentId) {
        flag = true
      } else {
        nodeId = findingParent?.parentId
      }





    }
    return updateResult;
  }





  async bulkValueChangeCalculations(
    payload: UpdateMultipleChartsDto,
  ) {
    const results: any[] = [];

    for (const chart of payload.charts) {
      const { id, ...updateData } = chart;


      const result = await this.valuechageCalculations(
        id,
        { id, ...updateData },
      );

      results.push(result);
    }

    return results;
  }


  async showHistory(projectId: string) {
    const history = await this.prisma.chartHistory.findMany({
      where: {
        chart: {
          projectId: projectId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        chart: true
      }
    });
    return history;
  }




  async Storetempleted(cloneSingleChartDto: CloneSingleChartDto) {
    const projectId = cloneSingleChartDto.id;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        rootCharts: true,
      },
    });

    if (!project || project.rootCharts.length === 0) {
      throw new NotFoundException('No root charts found');
    }

    const createdChartIds: string[] = [];

    for (const root of project.rootCharts) {
      const originalChart = await this.prisma.chartTable.findUnique({
        where: { id: root.value },
        include: {
          barChart: { include: { widgets: true } },
          horizontalBarChart: { include: { widgets: true } },
          pi: { include: { widgets: true } },
          heatmap: { include: { widgets: true } },
          areaChart: { include: { widgets: true } },
          multiAxisChart: { include: { widgets: true } },
          columnChart: { include: { widgets: true } },
          histogramChart: { include: { widgets: true } },
          paretoChart: { include: { widgets: true } },
          funnelChart: { include: { widgets: true } },
          waterFallChart: { include: { widgets: true } },
          radarChart: { include: { widgets: true } },
          doughnutChart: { include: { widgets: true } },
          candlestickChart: { include: { widgets: true } },
          stackedBarChart: { include: { widgets: true } },
          solidGaugeChart: { include: { widgets: true } },
          scatterChart: { include: { widgets: true } },
          splineChart: { include: { widgets: true } },
        },
      });

      if (!originalChart) continue;

      const createDto: CreateChartDto = {
        title: originalChart.title,
        grouptitle: cloneSingleChartDto.grouptitle,
        status: originalChart.status,
        category: originalChart.category,
        xAxis: JSON.stringify(originalChart.xAxis),
        yAxis: originalChart.yAxis
          ? JSON.stringify(originalChart.yAxis)
          : undefined,
        zAxis: originalChart.zAxis
          ? JSON.stringify(originalChart.zAxis)
          : undefined,
      };


      const chartMap = [
        originalChart.barChart,
        originalChart.horizontalBarChart,
        originalChart.pi,
        originalChart.heatmap,
        originalChart.areaChart,
        originalChart.multiAxisChart,
        originalChart.columnChart,
        originalChart.histogramChart,
        originalChart.paretoChart,
        originalChart.funnelChart,
        originalChart.waterFallChart,
        originalChart.radarChart,
        originalChart.doughnutChart,
        originalChart.candlestickChart,
        originalChart.stackedBarChart,
        originalChart.solidGaugeChart,
        originalChart.scatterChart,
        originalChart.splineChart,
      ].find(Boolean);

      if (chartMap) {
        const map = chartMap as any;
        Object.assign(createDto, {
          numberOfDataset: map.numberOfDataset,
          firstFieldDataset: map.firstFieldDataset,
          lastFieldDataset: map.lastFieldDataset,
          firstFiledDataset: map.firstFiledDataset,
          lastFiledDAtaset: map.lastFiledDAtaset,
          filter_By: map.filter_By,

          // Pareto fields
          Left_firstFieldDataset: map.Left_firstFieldDataset,
          Left_lastFieldDataset: map.Left_lastFieldDataset,
          Right_firstFieldDataset: map.Right_firstFieldDataset,
          Right_lastFieldDataset: map.Right_lastFieldDataset,

          // Solid Gauge fields
          startingRange: map.startingRange,
          endRange: map.endRange,
          gaugeValue: map.gaugeValue,
          chartHight: map.chartHight,
          startAngle: map.startAngle,
          endAngle: map.endAngle,
          trackColor: map.trackColor,
          strokeWidth: map.strokeWidth,
          valueFontSize: map.valueFontSize,
          shadeIntensity: map.shadeIntensity,

          widgets: map.widgets?.map((w: any) => ({
            legendName: w.legendName,
            color: w.color,
          })),
        });
      }


      const newChart = await this.create(createDto);
      createdChartIds.push(newChart.id);
    }


    await this.prisma.template.create({
      data: {
        name: cloneSingleChartDto.name,
        ownerid: cloneSingleChartDto.ownerid,
        chartList: createdChartIds,
      },
    });

    return createdChartIds;
  }

  async applyTemplate(applyTemplateDto: ApplyTemplateDto) {
    const { projectId, chartIds } = applyTemplateDto;

    const createdChartIds: string[] = [];

    for (const id of chartIds) {
      const originalChart = await this.prisma.chartTable.findUnique({
        where: { id },
        include: {
          barChart: { include: { widgets: true } },
          horizontalBarChart: { include: { widgets: true } },
          pi: { include: { widgets: true } },
          heatmap: { include: { widgets: true } },
          areaChart: { include: { widgets: true } },
          multiAxisChart: { include: { widgets: true } },
          columnChart: { include: { widgets: true } },
          histogramChart: { include: { widgets: true } },
          paretoChart: { include: { widgets: true } },
          funnelChart: { include: { widgets: true } },
          waterFallChart: { include: { widgets: true } },
          radarChart: { include: { widgets: true } },
          doughnutChart: { include: { widgets: true } },
          candlestickChart: { include: { widgets: true } },
          stackedBarChart: { include: { widgets: true } },
          solidGaugeChart: { include: { widgets: true } },
          scatterChart: { include: { widgets: true } },
          splineChart: { include: { widgets: true } },
        },
      });

      if (!originalChart) continue;


      const rootChartInfo = await this.prisma.rootChart.findFirst({
        where: { value: id }
      });

      const createDto: CreateChartDto = {
        title: originalChart.title,
        grouptitle: originalChart.grouptitle,
        status: originalChart.status,
        category: originalChart.category,
        projectId,
        rootchart: true,
        roottitle: rootChartInfo?.title ?? originalChart.title,

        xAxis: JSON.stringify(originalChart.xAxis),
        yAxis: originalChart.yAxis
          ? JSON.stringify(originalChart.yAxis)
          : undefined,
        zAxis: originalChart.zAxis
          ? JSON.stringify(originalChart.zAxis)
          : undefined,
      };

      const chartMap = [
        originalChart.barChart,
        originalChart.horizontalBarChart,
        originalChart.pi,
        originalChart.heatmap,
        originalChart.areaChart,
        originalChart.multiAxisChart,
        originalChart.columnChart,
        originalChart.histogramChart,
        originalChart.paretoChart,
        originalChart.funnelChart,
        originalChart.waterFallChart,
        originalChart.radarChart,
        originalChart.doughnutChart,
        originalChart.candlestickChart,
        originalChart.stackedBarChart,
        originalChart.solidGaugeChart,
        originalChart.scatterChart,
      ].find(Boolean);

      if (chartMap) {
        const map = chartMap as any;
        Object.assign(createDto, {
          numberOfDataset: map.numberOfDataset,
          firstFieldDataset: map.firstFieldDataset,
          lastFieldDataset: map.lastFieldDataset,
          firstFiledDataset: map.firstFiledDataset,
          lastFiledDAtaset: map.lastFiledDAtaset,
          filter_By: map.filter_By,
          Left_firstFieldDataset: map.Left_firstFieldDataset,
          Left_lastFieldDataset: map.Left_lastFieldDataset,
          Right_firstFieldDataset: map.Right_firstFieldDataset,
          Right_lastFieldDataset: map.Right_lastFieldDataset,
          startingRange: map.startingRange,
          endRange: map.endRange,
          gaugeValue: map.gaugeValue,
          chartHight: map.chartHight,
          startAngle: map.startAngle,
          endAngle: map.endAngle,
          trackColor: map.trackColor,
          strokeWidth: map.strokeWidth,
          valueFontSize: map.valueFontSize,
          shadeIntensity: map.shadeIntensity,
          widgets: map.widgets?.map((w: any) => ({
            legendName: w.legendName,
            color: w.color,
          })),
        });
      }

      const newChart = await this.create(createDto);
      createdChartIds.push(newChart.id);
    }

    return createdChartIds;
  }


  async rootChart(projectId: string) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.prisma.chartTable.findMany({
      where: {
        projectId,
        parentId: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        barChart: {
          include: { widgets: true },
        },
        horizontalBarChart: {
          include: { widgets: true },
        },
        pi: {
          include: { widgets: true },
        },
        heatmap: {
          include: { widgets: true },
        },
        areaChart: {
          include: { widgets: true },
        },
        multiAxisChart: {
          include: { widgets: true },
        },
        columnChart: {
          include: { widgets: true },
        },
        stackedBarChart: {
          include: { widgets: true },
        },
        doughnutChart: {
          include: { widgets: true },
        },
        paretoChart: {
          include: { widgets: true },
        },
        histogramChart: {
          include: { widgets: true },
        },
        scatterChart: {
          include: { widgets: true },
        },
        solidGaugeChart: {
          include: { widgets: true },
        },
        funnelChart: {
          include: { widgets: true },
        },
        waterFallChart: {
          include: { widgets: true },
        },
        candlestickChart: {
          include: { widgets: true },
        },
        radarChart: {
          include: { widgets: true },
        },
        splineChart: {
          include: { widgets: true },
        },
      },
    });
  }



  // async getOnlyLevelChildren(projectId: string) {
  //   return this.prisma.chartTable.findMany({
  //     where: {
  //       projectId,
  //       children: {
  //         none: {},
  //       },
  //     },
  //     orderBy: {
  //       createdAt: 'asc',
  //     },
  //     include: {
  //       barChart: {
  //         include: { widgets: true },
  //       },
  //       horizontalBarChart: {
  //         include: { widgets: true },
  //       },
  //       pi: {
  //         include: { widgets: true },
  //       },
  //       heatmap: {
  //         include: { widgets: true },
  //       },
  //       areaChart: {
  //         include: { widgets: true },
  //       },
  //       multiAxisChart: {
  //         include: { widgets: true },
  //       },
  //       columnChart: {
  //         include: { widgets: true },
  //       },
  //       stackedBarChart: {
  //         include: { widgets: true },
  //       },
  //       doughnutChart: {
  //         include: { widgets: true },
  //       },
  //       paretoChart: {
  //         include: { widgets: true },
  //       },
  //       histogramChart: {
  //         include: { widgets: true },
  //       },
  //       scatterChart: {
  //         include: { widgets: true },
  //       },
  //       solidGaugeChart: {
  //         include: { widgets: true },
  //       },
  //       funnelChart: {
  //         include: { widgets: true },
  //       },
  //       waterFallChart: {
  //         include: { widgets: true },
  //       },
  //       candlestickChart: {
  //         include: { widgets: true },
  //       },
  //       radarChart: {
  //         include: { widgets: true },
  //       },
  //     },
  //   });
  // }


  async getOnlyLevelChildren(projectId: string) {
    const charts = await this.prisma.chartTable.findMany({
      where: {
        projectId,
        children: {
          none: {},
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        barChart: { include: { widgets: true } },
        horizontalBarChart: { include: { widgets: true } },
        pi: { include: { widgets: true } },
        heatmap: { include: { widgets: true } },
        areaChart: { include: { widgets: true } },
        multiAxisChart: { include: { widgets: true } },
        columnChart: { include: { widgets: true } },
        stackedBarChart: { include: { widgets: true } },
        doughnutChart: { include: { widgets: true } },
        paretoChart: { include: { widgets: true } },
        histogramChart: { include: { widgets: true } },
        scatterChart: { include: { widgets: true } },
        solidGaugeChart: { include: { widgets: true } },
        funnelChart: { include: { widgets: true } },
        waterFallChart: { include: { widgets: true } },
        candlestickChart: { include: { widgets: true } },
        radarChart: { include: { widgets: true } },
        splineChart: { include: { widgets: true } },
      },
    });


    const grouped = charts.reduce((acc, chart) => {
      if (!acc[chart.grouptitle]) {
        acc[chart.grouptitle] = [];
      }
      acc[chart.grouptitle].push(chart);
      return acc;
    }, {} as Record<string, typeof charts>);


    return Object.entries(grouped).map(([grouptitle, charts]) => ({
      grouptitle,
      charts,
    }));
  }





  async findAllByProject(projectId: string) {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    return this.prisma.chartTable.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        barChart: {
          include: { widgets: true },
        },
        horizontalBarChart: {
          include: { widgets: true },
        },
        pi: {
          include: { widgets: true },
        },
        heatmap: {
          include: { widgets: true },
        },
        areaChart: {
          include: { widgets: true },
        },
        multiAxisChart: {
          include: { widgets: true },
        },
        columnChart: {
          include: { widgets: true },
        },
        stackedBarChart: {
          include: { widgets: true },
        },
        doughnutChart: {
          include: { widgets: true },
        },
        paretoChart: {
          include: { widgets: true },
        },
        histogramChart: {
          include: { widgets: true },
        },
        scatterChart: {
          include: { widgets: true },
        },
        solidGaugeChart: {
          include: { widgets: true },
        },
        funnelChart: {
          include: { widgets: true },
        },
        waterFallChart: {
          include: { widgets: true },
        },
        candlestickChart: {
          include: { widgets: true },
        },
        radarChart: {
          include: { widgets: true },
        },
        splineChart: {
          include: { widgets: true },
        },
      },
    });
  }

  async safeDeleteChart(id: string) {
    return this.prisma.$transaction(async (tx) => {

      const chart = await tx.chartTable.findUnique({
        where: { id },
        include: {
          children: true,
          history: true,
        },
      });

      if (!chart) {
        throw new NotFoundException('Chart not found');
      }

      // 1️⃣ Check if used in RootChart
      const usedInRoot = await tx.rootChart.findFirst({
        where: { value: id },
      });

      if (usedInRoot) {
        throw new BadRequestException(
          'Chart is used in RootChart. Cannot delete.',
        );
      }

      // 2️⃣ Check if it has children
      if (chart.children.length > 0) {
        throw new BadRequestException(
          'Chart has child charts. Cannot delete.',
        );
      }

      // 3️⃣ Check if it has history
      if (chart.history.length > 0) {
        throw new BadRequestException(
          'Chart has history records. Cannot delete.',
        );
      }

      // 4️⃣ Delete related subchart manually (important)
      await tx.barChart.deleteMany({ where: { ChartTableId: id } });
      await tx.horizontalBarChart.deleteMany({ where: { chartTableId: id } });
      await tx.pi.deleteMany({ where: { chartTableId: id } });
      await tx.heatMapChart.deleteMany({ where: { chartTableId: id } });
      await tx.areaChart.deleteMany({ where: { chartTableId: id } });
      await tx.multiAxisChart.deleteMany({ where: { chartTableId: id } });
      await tx.columnChart.deleteMany({ where: { chartTableId: id } });
      await tx.stackedBarChart.deleteMany({ where: { ChartTableId: id } });
      await tx.doughnutChart.deleteMany({ where: { chartTableId: id } });
      await tx.paretoChart.deleteMany({ where: { chartTableId: id } });
      await tx.histogramChart.deleteMany({ where: { chartTableId: id } });
      await tx.scatterChart.deleteMany({ where: { chartTableId: id } });
      await tx.solidGaugeChart.deleteMany({ where: { chartTableId: id } });
      await tx.funnelChart.deleteMany({ where: { chartTableId: id } });
      await tx.waterFallChart.deleteMany({ where: { chartTableId: id } });
      await tx.candlestickChart.deleteMany({ where: { chartTableId: id } });
      await tx.radarChart.deleteMany({ where: { chartTableId: id } });
      await tx.splineChart.deleteMany({ where: { ChartTableId: id } });

      // 5️⃣ Finally delete main chart
      return tx.chartTable.delete({
        where: { id },
      });
    });
  }



}




